# warp-js
Warp JS SDK to implement a client for Warp protocol

## Installation
1. Install dependency 
``
yarn install
``
2. build file as local or development
``
	yarn run build:local 
``
or
``
	yarn run build:development
``
3. create link to another project ( [ warp-client ](https://github.com/evrynet-official/warp-client](https://github.com/evrynet-official/warp-client)) ) 
``
	yarn link
``


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

#### Get user's FeStellar account sequence number
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

#### Generate evrynet lock native transaction
  - Request
```
evry.newLockNativeTx({ 
	secret: "evrynet private key", 
	amount: "1234"
})
```
  - Response
```
rawTx: "0xabcd"
```

#### Generate evrynet unlock native transaction
  - Request
```
evry.newUnlockNativeTx({ 
	secret: "evrynet private key", 
	amount: "1234"
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