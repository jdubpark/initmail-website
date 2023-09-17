const contracts = {
  31337: [
    {
      chainId: "31337",
      name: "localhost",
      contracts: {
        Intimail: {
          address: "0x87411145423fDf9123040799F9Ff894153339a75",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_wormholeRelayer",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_wormhole",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_paymentToken",
                  type: "address",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "emailId",
                  type: "bytes32",
                },
              ],
              name: "EmailCancelled",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "emailId",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "payer",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "payAmount",
                  type: "uint256",
                },
              ],
              name: "EmailPaid",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "emailId",
                  type: "bytes32",
                },
              ],
              name: "EmailReplied",
              type: "event",
            },
            {
              inputs: [],
              name: "PAYMENT_TOKEN",
              outputs: [
                {
                  internalType: "contract IERC20Minimal",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "emailId",
                  type: "bytes32",
                },
                {
                  internalType: "uint256",
                  name: "minAmount",
                  type: "uint256",
                },
                {
                  internalType: "uint64",
                  name: "duration",
                  type: "uint64",
                },
              ],
              name: "createEmail",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "emailId",
                  type: "bytes32",
                },
              ],
              name: "emails",
              outputs: [
                {
                  components: [
                    {
                      internalType: "uint256",
                      name: "minAmount",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "paidAmount",
                      type: "uint256",
                    },
                    {
                      internalType: "uint64",
                      name: "createdAt",
                      type: "uint64",
                    },
                    {
                      internalType: "uint64",
                      name: "paidAt",
                      type: "uint64",
                    },
                    {
                      internalType: "uint64",
                      name: "repliedAt",
                      type: "uint64",
                    },
                    {
                      internalType: "uint64",
                      name: "duration",
                      type: "uint64",
                    },
                    {
                      internalType: "address",
                      name: "payer",
                      type: "address",
                    },
                    {
                      internalType: "enum Intimail.EmailStatus",
                      name: "status",
                      type: "uint8",
                    },
                  ],
                  internalType: "struct Intimail.Email",
                  name: "",
                  type: "tuple",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "emailId",
                  type: "bytes32",
                },
                {
                  internalType: "enum Intimail.EmailStatus",
                  name: "status",
                  type: "uint8",
                },
                {
                  internalType: "address",
                  name: "emailSender",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "emailRecipient",
                  type: "address",
                },
              ],
              name: "modifyEmailStatus",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "emailId",
                  type: "bytes32",
                },
                {
                  internalType: "uint256",
                  name: "payAmount",
                  type: "uint256",
                },
              ],
              name: "payForEmail",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint16",
                  name: "targetChain",
                  type: "uint16",
                },
              ],
              name: "quoteEmailPayment",
              outputs: [
                {
                  internalType: "uint256",
                  name: "cost",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes",
                  name: "payload",
                  type: "bytes",
                },
                {
                  internalType: "bytes[]",
                  name: "",
                  type: "bytes[]",
                },
                {
                  internalType: "bytes32",
                  name: "sourceAddress",
                  type: "bytes32",
                },
                {
                  internalType: "uint16",
                  name: "sourceChain",
                  type: "uint16",
                },
                {
                  internalType: "bytes32",
                  name: "deliveryVaaHash",
                  type: "bytes32",
                },
              ],
              name: "receiveWormholeMessages",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              name: "seenDeliveryVaaHashes",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint16",
                  name: "targetChain",
                  type: "uint16",
                },
                {
                  internalType: "address",
                  name: "targetAddress",
                  type: "address",
                },
                {
                  internalType: "bytes32",
                  name: "emailId",
                  type: "bytes32",
                },
                {
                  internalType: "uint256",
                  name: "payAmount",
                  type: "uint256",
                },
              ],
              name: "sendEmailPayment",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint16",
                  name: "sourceChain",
                  type: "uint16",
                },
                {
                  internalType: "bytes32",
                  name: "sourceAddress",
                  type: "bytes32",
                },
              ],
              name: "setRegisteredSender",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "recipient",
                  type: "address",
                },
              ],
              name: "withdrawBalanceViaAdmin",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "wormhole",
              outputs: [
                {
                  internalType: "contract IWormhole",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "wormholeRelayer",
              outputs: [
                {
                  internalType: "contract IWormholeRelayer",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
        },
      },
    },
  ],
  42161: [
    {
      chainId: "42161",
      name: "Arbitrum One",
      contracts: {
        Intimail: {
          address: "0x3b15814922bAB87068E0D2480cacd0F805C0B7e3",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_wormholeRelayer",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_wormhole",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_paymentToken",
                  type: "address",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "emailId",
                  type: "bytes32",
                },
              ],
              name: "EmailCancelled",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "emailId",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "payer",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "payAmount",
                  type: "uint256",
                },
              ],
              name: "EmailPaid",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "emailId",
                  type: "bytes32",
                },
              ],
              name: "EmailReplied",
              type: "event",
            },
            {
              inputs: [],
              name: "PAYMENT_TOKEN",
              outputs: [
                {
                  internalType: "contract IERC20Minimal",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "emailId",
                  type: "bytes32",
                },
                {
                  internalType: "uint256",
                  name: "minAmount",
                  type: "uint256",
                },
                {
                  internalType: "uint64",
                  name: "duration",
                  type: "uint64",
                },
              ],
              name: "createEmail",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "emailId",
                  type: "bytes32",
                },
              ],
              name: "emails",
              outputs: [
                {
                  components: [
                    {
                      internalType: "uint256",
                      name: "minAmount",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "paidAmount",
                      type: "uint256",
                    },
                    {
                      internalType: "uint64",
                      name: "createdAt",
                      type: "uint64",
                    },
                    {
                      internalType: "uint64",
                      name: "paidAt",
                      type: "uint64",
                    },
                    {
                      internalType: "uint64",
                      name: "repliedAt",
                      type: "uint64",
                    },
                    {
                      internalType: "uint64",
                      name: "duration",
                      type: "uint64",
                    },
                    {
                      internalType: "address",
                      name: "payer",
                      type: "address",
                    },
                    {
                      internalType: "enum Intimail.EmailStatus",
                      name: "status",
                      type: "uint8",
                    },
                  ],
                  internalType: "struct Intimail.Email",
                  name: "",
                  type: "tuple",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "emailId",
                  type: "bytes32",
                },
                {
                  internalType: "enum Intimail.EmailStatus",
                  name: "status",
                  type: "uint8",
                },
                {
                  internalType: "address",
                  name: "emailSender",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "emailRecipient",
                  type: "address",
                },
              ],
              name: "modifyEmailStatus",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "emailId",
                  type: "bytes32",
                },
                {
                  internalType: "uint256",
                  name: "payAmount",
                  type: "uint256",
                },
              ],
              name: "payForEmail",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint16",
                  name: "targetChain",
                  type: "uint16",
                },
              ],
              name: "quoteEmailPayment",
              outputs: [
                {
                  internalType: "uint256",
                  name: "cost",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes",
                  name: "payload",
                  type: "bytes",
                },
                {
                  internalType: "bytes[]",
                  name: "",
                  type: "bytes[]",
                },
                {
                  internalType: "bytes32",
                  name: "sourceAddress",
                  type: "bytes32",
                },
                {
                  internalType: "uint16",
                  name: "sourceChain",
                  type: "uint16",
                },
                {
                  internalType: "bytes32",
                  name: "deliveryVaaHash",
                  type: "bytes32",
                },
              ],
              name: "receiveWormholeMessages",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              name: "seenDeliveryVaaHashes",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint16",
                  name: "targetChain",
                  type: "uint16",
                },
                {
                  internalType: "address",
                  name: "targetAddress",
                  type: "address",
                },
                {
                  internalType: "bytes32",
                  name: "emailId",
                  type: "bytes32",
                },
                {
                  internalType: "uint256",
                  name: "payAmount",
                  type: "uint256",
                },
              ],
              name: "sendEmailPayment",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint16",
                  name: "sourceChain",
                  type: "uint16",
                },
                {
                  internalType: "bytes32",
                  name: "sourceAddress",
                  type: "bytes32",
                },
              ],
              name: "setRegisteredSender",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "recipient",
                  type: "address",
                },
              ],
              name: "withdrawBalanceViaAdmin",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "wormhole",
              outputs: [
                {
                  internalType: "contract IWormhole",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "wormholeRelayer",
              outputs: [
                {
                  internalType: "contract IWormholeRelayer",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
