const env = process.env.NODE_ENV
import Common from 'ethereumjs-common'
import Stellar from 'stellar-base'

// configuration file is used to configure application and interfaces
// If anything needs to be sucured, save it in an environement variable file (.env) and paste process.env.[#varname] to this config file.
import Web3 from 'web3'
const web3 = new Web3()

const development = {
  evrynet: {
    DEFAULT_CONTRACT_ADDRESS: '0x81e37ac7D0deD9cbc262F9fA0f9637Ced19cfa07',
    GASPRICE: web3.utils.toHex(Number(web3.utils.toWei('1', 'gwei'))),
    ATOMIC_STELLAR_DECIMAL_UNIT: 7,
    ATOMIC_EVRY_DECIMAL_UNIT: 18,
    CUSTOM_CHAIN: Common.forCustomChain(
      'mainnet',
      {
        name: 'evry-dev',
        chainId: 15,
        networkId: 15,
      },
      'constantinople',
    ),
  },
  stellar: {
    ESCROW_ACCOUNT: 'GAAQ4EOKRV3O5MC42JPREIUYRCTXUE6JLXWHMETM24AFACXWE54FQATQ',
    EVRY_ASSET_NAME: 'EVRY',
    EVRY_ASSET_ISSUER_PUB:
      'GATIJFZRBQH6S2BM2M2LPK7NMZWS43VQJQJNMSAR7LHW3XVPBBNV7BE5',
    NETWORK: Stellar.Networks.TESTNET,
  },
  grpc: {
    STELLAR: 'stellar',
    EVRYNET: 'evrynet',
    TRANSFER: 'transfer',
    DEFAULT_HOST: 'localhost:9090',
  },
  contract: {
    ABI: {
      WARP: 'warpABI',
    },
  },
}

const local = {
  ...development,
  evrynet: {
    ...development.evrynet,
    CUSTOM_CHAIN: Common.forCustomChain(
      'mainnet',
      {
        name: 'warp-network-local',
        networkId: 5777,
        chainId: 5777,
      },
      'constantinople',
    ),
  },
}

const test = local

const production = {}

const config = {
  development,
  production,
  test,
  local,
}

export default config[env]
