const env = process.env.NODE_ENV

// configuration file is used to configure application and interfaces
// If anything needs to be sucured, save it in an environement variable file (.env) and paste process.env.[#varname] to this config file.
import Web3 from 'web3'
const web3 = new Web3()

const development = {
  evrynet: {
    DEFAULT_CONTRACT_ADDRESS: '0xd4eCE34f1e8111f15C23F06A12299256e0722Db9',
    GASLIMIT: web3.utils.toHex(50000),
    GASPRICE: web3.utils.toHex(Number(web3.utils.toWei('1', 'gwei'))),
  },
  stellar: {
    ESCROW_ACCOUNT: 'GAAQ4EOKRV3O5MC42JPREIUYRCTXUE6JLXWHMETM24AFACXWE54FQATQ',
    EVRY_ASSET_NAME: 'EVRY',
    EVRY_ASSET_ISSUER_PUB:
      'GATIJFZRBQH6S2BM2M2LPK7NMZWS43VQJQJNMSAR7LHW3XVPBBNV7BE5',
    ATOMIC_STELLAR_DECIMAL_UNIT: 7,
    ATOMIC_EVRY_DECIMAL_UNIT: 18,
  },
  grpc: {
    STELLAR: 'stellar',
    EVRYNET: 'evrynet',
    TRANSFER: 'transfer',
    DEFAULT_HOST: 'localhost:8080',
  },
  contract: {
    ABI: {
      WARP: 'warpABI',
    },
  },
}

const test = development

const production = {}

const config = {
  development,
  production,
  test,
}

export default config[env]
