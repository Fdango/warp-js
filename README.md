# warp-js
Warp JS SDK to implement a client for Warp protocol

## Contents

- [Installation](#installation)
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

## Installation
1. Install dependency 
```
yarn install
```
2. build file on local or development
```
yarn run build:local 
```
or
```
yarn run build:development
```
3. create link to another project ( such as [ warp-client  ](https://github.com/evrynet-official/warp-client) ) 
```
yarn link
```


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