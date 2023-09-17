// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Base} from "./wormhole-solidity-sdk/WormholeRelayerSDK.sol";
import {IWormholeReceiver} from "./wormhole-solidity-sdk/interfaces/IWormholeReceiver.sol";

import {IERC20Minimal} from "./mock/MockERC20.sol";

contract Intimail is Base, IWormholeReceiver {
    event EmailPaid(bytes32 emailId, address payer, uint256 payAmount);
    event EmailReplied(bytes32 emailId);
    event EmailCancelled(bytes32 emailId);

    enum EmailStatus {
        PENDING_PAYMENT, // pending payment from sender (could be from anyone)
        PENDING_REPLY, // pending reply from recipient (so, already sent to user)
        CANCELLED, // cancelled
        INVALIDATED, // invalidated by system
        FAILED, // failed to deliver (for whatever reason)
        REPLIED // recipient has replied
    }

    // pack slots (amounts are unfortunately 256 bits)
    struct Email {
        uint256 minAmount; // min required by recipient
        uint256 paidAmount; // amount paid by sender
        uint64 createdAt; // UNIX seconds
        uint64 paidAt; // UNIX seconds
        uint64 repliedAt; // UNIX seconds
        uint64 duration; // valid duration from `createdAt`
        address payer;
        EmailStatus status;
    }

    // Wormhole delivery gas limits
    uint256 constant WH_EMAIL_PAYMENT_GAS_LIMIT = 150_000;
    // uint256 constant WH_CONFIRMATION_GAS_LIMIT = 50_000;

    IERC20Minimal public PAYMENT_TOKEN;

    address private _owner;

    mapping(bytes32 => Email) private _emails;

    mapping(address => uint256) private _outstandingBalances; // earned balances that are not yet withdrawn

    constructor(
        address _wormholeRelayer,
        address _wormhole,
        address _paymentToken // ie. USDC on each chain
    ) Base(_wormholeRelayer, _wormhole) {
        _transferOwnership(msg.sender);

        PAYMENT_TOKEN = IERC20Minimal(_paymentToken);
    }

    modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    //
    //
    // Intimail Logics
    //
    //

    function createEmail(
        bytes32 emailId,
        uint256 minAmount,
        uint64 duration
    ) public onlyOwner {
        require(_emails[emailId].createdAt == 0, "Email already exists");
        _emails[emailId] = Email({
            minAmount: minAmount,
            paidAmount: 0,
            createdAt: uint64(block.timestamp),
            paidAt: 0,
            repliedAt: 0,
            duration: duration,
            status: EmailStatus.PENDING_PAYMENT,
            payer: address(0)
        });
    }

    function modifyEmailStatus(
        bytes32 emailId,
        EmailStatus status,
        address emailSender,
        address emailRecipient
    ) public onlyOwner {
        require(
            emailSender != address(0) && emailRecipient != address(0),
            "Emails cannot be zero address"
        );

        require(_emails[emailId].createdAt != 0, "Email does not exist");

        Email storage email = _emails[emailId]; // SLOAD here to reduce gas (load as `storage`!)
        email.status = status;

        if (status == EmailStatus.REPLIED) {
            email.repliedAt = uint64(block.timestamp);
            _outstandingBalances[emailRecipient] += email.paidAmount;

            emit EmailReplied(emailId);
        } else if (
            status == EmailStatus.CANCELLED || status == EmailStatus.FAILED
        ) {
            if (email.paidAmount > 0) {
                // refund sender
                PAYMENT_TOKEN.transferFrom(
                    address(this),
                    emailSender,
                    email.paidAmount
                );
                email.paidAmount = 0;
            }

            emit EmailCancelled(emailId);
        } else if (status == EmailStatus.INVALIDATED) {
            // TODO: invalidated email due to reasons like spam, flagged for malicious intent, etc.
        }
    }

    function payForEmail(bytes32 emailId, uint256 payAmount) public {
        Email memory email = _emails[emailId]; // SLOAD here to reduce gas (load as `view-only`!)

        require(email.createdAt != 0, "Email does not exist");
        require(
            email.status == EmailStatus.PENDING_PAYMENT,
            "Email is not pending payment"
        );
        require(
            PAYMENT_TOKEN.balanceOf(msg.sender) >= email.minAmount,
            "Insufficient balance for payment"
        );
        require(
            PAYMENT_TOKEN.allowance(msg.sender, address(this)) >= payAmount,
            "Insufficient allowance for payment"
        );

        PAYMENT_TOKEN.transferFrom(msg.sender, address(this), payAmount);

        _markEmailAsPaid(emailId, msg.sender, payAmount);
    }

    function _markEmailAsPaid(bytes32 emailId, address payer, uint256 payAmount) internal {
        Email storage email = _emails[emailId]; // SLOAD here to reduce gas (load as `storage`!)

        email.paidAmount = payAmount;
        email.paidAt = uint64(block.timestamp);
        email.status = EmailStatus.PENDING_REPLY;
        email.payer = payer;

        emit EmailPaid(emailId, payer, payAmount);
    }

    // function withdrawBalance() public {
    //     uint256 balance = _outstandingBalances[msg.sender];
    //     require(balance > 0, "No balance to withdraw");
    //
    //     _outstandingBalances[msg.sender] = 0;
    //     PAYMENT_TOKEN.transferFrom(address(this), msg.sender, balance);
    // }

    function withdrawBalanceViaAdmin(address recipient) public onlyOwner {
        uint256 balance = _outstandingBalances[recipient];
        require(balance > 0, "No balance to withdraw");

        _outstandingBalances[recipient] = 0;
        PAYMENT_TOKEN.transferFrom(address(this), recipient, balance);
    }

    //
    //
    // Wormhole Cross-Chain Logics
    //
    //

    function quoteEmailPayment(
        uint16 targetChain
    ) public view returns (uint256 cost) {
        (cost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            0,
            WH_EMAIL_PAYMENT_GAS_LIMIT
        );
    }

    // function quoteConfirmation(
    //     uint16 targetChain
    // ) public view returns (uint256 cost) {
    //     (cost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
    //         targetChain,
    //         0,
    //         WH_CONFIRMATION_GAS_LIMIT
    //     );
    // }

    /// @dev Cross-chain email payment!
    function sendEmailPayment(
        uint16 targetChain,
        address targetAddress,
        bytes32 emailId,
        uint256 payAmount
    ) public payable {
        uint256 cost = quoteEmailPayment(targetChain);
        require(msg.value == cost);

        // First, lock-in tokens on this contract (we don't actually send the tokens to the target chain)
        // Then, send the payload of `emailId` and `payAmount` to the target chain

        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            targetAddress,
            abi.encode(emailId, msg.sender, payAmount), // payload
            0, // no receiver value needed since we're just passing a message
            WH_EMAIL_PAYMENT_GAS_LIMIT
        );
    }

    /// @dev function name & paramter tpyes must match the interface for correct function signature
    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory, // additionalVaas
        bytes32 sourceAddress, // address that called 'sendPayloadToEvm' (Intimail contract address)
        uint16 sourceChain,
        bytes32 deliveryVaaHash
    )
        public
        payable
        override
        onlyWormholeRelayer
        isRegisteredSender(sourceChain, sourceAddress)
        replayProtect(deliveryVaaHash)
    {
        (bytes32 emailId, address payer, uint256 payAmount) = abi.decode(
            payload,
            (bytes32, address, uint256)
        );

        // Require that email was not paid before, otherwise reject the payment (send back)
        if (_emails[emailId].paidAmount > 0) {
            // TODO: send back the payment
            return;
        }

        _markEmailAsPaid(emailId, payer, payAmount);
    }

    //
    //
    // Misc. Logics
    //
    //

    function emails(bytes32 emailId) public view returns (Email memory) {
        return _emails[emailId];
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: ew owner is the zero address"
        );
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        _owner = newOwner;
    }
}
