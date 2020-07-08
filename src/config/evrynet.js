import { web3Instance } from '@/utils'
import Common from 'ethereumjs-common'
export default class EvrynetConfig {
  constructor() {
    this.gasLimit = 2000000
    this.gasPrice = web3Instance.utils.toHex(
      Number(web3Instance.utils.toWei('1', 'gwei')),
    )
    // Tendermint node doesn't work with estimate gas because cors origin.
    // TODO: Remove shouldUseEstimatedGas before launch.
    this.shouldUseEstimatedGas = false
    this.atomicStellarDecimalUnit = 7
    this.atomicEvryDecimalUnit = 18
    this.customChain = Common.forCustomChain(
      'mainnet',
      {
        name: 'evry-dev',
        chainId: 101,
        networkId: 101,
      },
      'constantinople',
    )
    this.provider = web3Instance.givenProvider
    this.contract = {
      nativeCustodian: {
        address: '0xf582b66AC081253B67eA7ABB76919B27F75D361d',
      },
      evrynetCustodian: {
        address: '0xf582b66AC081253B67eA7ABB76919B27F75D361d',
      },
      stellarCustodian: {
        address: '0xf582b66AC081253B67eA7ABB76919B27F75D361d',
      },
    }
    Object.seal(this)
  }
}
