export default [
  {
    "constant": false,
    "inputs": [],
    "name": "renounceWhitelistAdmin",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "name": "addWhitelistAdmin",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isWhitelistAdmin",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_whitelistAssetsAddr",
        "type": "address"
      },
      {
        "name": "_native",
        "type": "address"
      },
      {
        "name": "_threshold",
        "type": "uint16"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "assetName",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "tokens",
        "type": "uint256"
      }
    ],
    "name": "Unlock",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "tokens",
        "type": "uint256"
      }
    ],
    "name": "UnlockNative",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "tokenOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "assetName",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "tokens",
        "type": "uint256"
      }
    ],
    "name": "Lock",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "tokens",
        "type": "uint256"
      }
    ],
    "name": "LockNative",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "proposedContract",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "assetName",
        "type": "bytes32"
      }
    ],
    "name": "Migrate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "account",
        "type": "address"
      }
    ],
    "name": "WhitelistAdminAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "account",
        "type": "address"
      }
    ],
    "name": "WhitelistAdminRemoved",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "proposedContract",
        "type": "address"
      },
      {
        "name": "assetName",
        "type": "bytes32"
      }
    ],
    "name": "migrationPropose",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "proposedContract",
        "type": "address"
      },
      {
        "name": "assetName",
        "type": "bytes32"
      }
    ],
    "name": "migrate",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "assetName",
        "type": "bytes32"
      },
      {
        "name": "tokens",
        "type": "uint256"
      }
    ],
    "name": "unlock",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "assetName",
        "type": "bytes32"
      },
      {
        "name": "tokens",
        "type": "uint256"
      }
    ],
    "name": "lock",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "tokens",
        "type": "uint256"
      }
    ],
    "name": "unlockNative",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "lockNative",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getWhitelistAssets",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]