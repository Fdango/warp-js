# warp-js
Warp JS SDK to implement a client for Warp protocol

## Contents

- [Installation](#installation)
- [Developing](#developing)
- [Versioning](#versioning)
- [Tests](#tests)
- [Style Guide](#style-guide)
- [Function examples](#function-examples)
    - [Get available assets](#get-available-assets)
    - [Get user's Evrynet account balance](#get-users-evrynet-account-balance)
    - [Get user’s Evrynet account nonce](#get-users-evrynet-account-nonce)
    - [Get user’s Stellar account balance](#get-users-stellar-account-balance)
    - [Get user's Stellar account trustlines](#get-users-stellar-account-trustlines)
    - [Get user's Stellar account sequence number](#get-users-stellar-account-sequence-number)
    - [Generate stellar lock transaction](#generate-stellar-lock-transaction)
    - [Generate stellar unlock transaction](#generate-stellar-unlock-transaction)
    - [Generate evrynet lock transaction](#generate-evrynet-lock-transaction)
    - [Generate evrynet unlock transaction](#generate-evrynet-unlock-transaction)
    - [Transfer asset from stellar to evrynet](#transfer-asset-from-stellar-to-evrynet)
    - [Transfer asset from evrynet to stellar](#transfer-asset-from-evrynet-to-stellar)
- [Licensing](#licensing)

## Installation
```console
$ npm install @evrynetlabs/warp-js
```

## Developing
### Build With
- [Stellar SDK](https://www.stellar.org/developers/js-stellar-sdk/reference/)
- [Ethereum JS](https://github.com/ethereumjs)
- [Web3](https://github.com/ethereum/web3.js/)

### Prerequisites
- Knowledge of Warp Contract [here](https://github.com/evrynetlabs/warp-contract)
- Knowledge of EER-2 (Evrynet Enhancement Request) [here](https://github.com/evrynetlabs/credit-contract)
    - User needs to `setApprovalForAll(address _operator, bool _approved)` and let a custodian contract as an operator.
     - For custom credit contract, user needs to `SetMinter(uint256 indexed _typeID, address _minter);` and let let a custodian contract as a minter.

### Building
For local development
```console
$ yarn run build:local
```

or

```console
$ yarn run build:development
```

For production use

```console
$ yarn run build:production
```

## Versioning
We use a [SemVer](https://semver.org/) for versioning. Please see the [release](https://github.com/Evrynetlabs/warp-js/releases).

## Tests
For unit testing

```console 
$ yarn run test
```

For unit testing with coverage
```console
$ yarn run test-coverage
```

Jest as well as Enzyme has been used for testing libraries.

## Style guide
Eslint has been used for linting as well as prettier
- For Lint check, run:
```console 
$ yarn run lint
```
- For prettier format, run:
```console
$ yarn run format
```

## Api Reference
Please see [this link](https://github.com/Evrynetlabs/warp)

## Function examples
You can find example at warp-js example 

#### Get available assets
   - Request
```
evry.getWhitelistAssets()
```
   - Response
```
assets: [ 
	{ 
		code: "XLM", 
		issuer: "", 
		decimal: 7, 
		typeID: "1"
	}
]
```

#### Get user's Evrynet account balance
   - Request
```
evry.getBalance({ 
	address: "0x1234", 
	asset: { 
		code: "EVRY", 
		issuer: "issuer", 
		decimal: 18, 
		typeID: "2" 
		} 
})
```
  - Response
```
balance: 10
```

#### Get user's Evrynet account nonce
  - Request
```
evry.getNonce({ address: "0x1234" })
```
  - Response
```
nonce: "1234"
```

#### Get user's Stellar account balance
  - Request
```
stellar.getBalance({ 
	address: "stellar public key", 
	asset: { 
		code: "vTHB", 
		issuer: "issuer", 
		decimal: 2, 
		typeID: "3" 
	} 
})
```
  - Response
```
balance: "10"
```

#### Get user's Stellar account trustlines
  - Request
```
stellar.getTrustlines({ address: "stellar public key" })
```
  - Response
```
assets:[ 
	{ 
		code: "EVRY", 
		issuer: "issuer" 
	} 
]
```

#### Get user's Stellar account sequence number
  - Request
```
stellar.getSequenceNumber({ address: "stellar public key" })
```
  - Response
```
sequenceNumber: "1234"
```

#### Generate stellar lock transaction
  - Request
```
stellar.newLockTx({ 
	secret: "stellar private key", 
	amount: "1234", 
	asset: { 
		code: "XLM", 
		issuer: ""
	} 
})
```
  - Response
```
xdr: ""
```

#### Generate stellar unlock transaction
  - Request
```
stellar.newUnlockTx({ 
	secret: "stellar private key", 
	amount: "1234", 
	asset: { 
		code: "XLM", 
		issuer: ""
	} 
})
```
  - Response
```
xdr: ""
```

#### Generate evrynet lock transaction
  - Request
```
evry.newLockTx({ 
	secret: "evrynet private key", 
	amount: "1234", 
	asset: { 
		code: "XLM", 
		issuer: "", 
		decimal: 7, 
		typeID: "1" 
	} 
})
```
  - Response
```
rawTx: "0xabcd"
```

#### Generate evrynet unlock transaction
  - Request
```
evry.newUnlockTx({ 
	secret: "evrynet private key", 
	amount: "1234", 
	asset: { 
		code: "XLM", 
		issuer: "", 
		decimal: 7, 
		typeID: "1" 
	} 
})
```
  - Response
```
rawTx: "0xabcd"
```

#### Transfer asset from stellar to evrynet
  - Request
```
warp.toEvrynet({ rawTx: "0xabcd", xdr: "", })
```
  - Response
```
{ stellarTxHash: "0x1234", evrynetTxHash: "0x1234" }
```

#### Transfer asset from evrynet to stellar
  - Request
```
warp.toStellar({ rawTx: "0xabcd", xdr: "", })
```
  - Response
```
{ stellarTxHash: "0x1234", evrynetTxHash: "0x1234" }
```

## Licensing
Warp client is licensed under the OSL Open Software License v3.0, also included in our repository in the LICENSE file.