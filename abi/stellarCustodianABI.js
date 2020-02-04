export default [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_typeID",
                "type": "uint256"
            }
        ],
        "name": "add",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_typeID",
                "type": "uint256"
            },
            {
                "name": "_value",
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
                "name": "_typeID",
                "type": "uint256"
            },
            {
                "name": "_value",
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
                "name": "_typeID",
                "type": "uint256"
            },
            {
                "name": "_prevTypeID",
                "type": "uint256"
            }
        ],
        "name": "remove",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "linklist",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            }
        ],
        "name": "migrationVote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "assets",
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
                "name": "_credit",
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
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "typeID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "value",
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
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "typeID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "value",
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
                "name": "typeID",
                "type": "uint256"
            }
        ],
        "name": "AddedAsset",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "typeID",
                "type": "uint256"
            }
        ],
        "name": "RemovedAsset",
        "type": "event"
    }
]