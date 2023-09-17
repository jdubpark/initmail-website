// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IERC20Minimal {
    function balanceOf(address account) external view returns (uint256);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
}

interface IMockERC20 is IERC20Minimal {
    function approve(address spender, uint256 value) external returns (bool);

    function mint(address account, uint256 amount) external returns (bool);
}

// implement ERC20 contract that conforms to the interface `IERC20Minimal`
contract MockERC20 is IMockERC20 {
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    constructor() {}

    function balanceOf(
        address account
    ) external view override returns (uint256) {
        return balances[account];
    }

    function allowance(
        address owner,
        address spender
    ) external view override returns (uint256) {
        return allowances[owner][spender];
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external override returns (bool) {
        require(balances[from] >= value, "insufficient balance");
        require(
            allowances[from][msg.sender] >= value,
            "insufficient allowance"
        );
        balances[from] -= value;
        balances[to] += value;
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowances[msg.sender][spender] = value;
        return true;
    }

    function mint(address account, uint256 amount) external returns (bool) {
        balances[account] += amount;
        return true;
    }
}
