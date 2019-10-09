import { web3Instance } from '@/utils'
import Common from 'ethereumjs-common'
export default class EvrynetConfig {
  constructor() {
    this.contractAddress = '0xf582b66AC081253B67eA7ABB76919B27F75D361d'
    this.gasLimit = 2000000
    this.gasPrice = web3Instance.utils.toHex(
      Number(web3Instance.utils.toWei('1', 'gwei')),
    )
    // Tendermint node doesn't work with estimate gas because cors origin.
    // TODO: Remove isEstimateGas before lunch.
    this.isEstimateGas = false
    this.atomicStellarDecimalUnit = 7
    this.atomicEvryDecimalUnit = 18
    this.customChain = Common.forCustomChain(
      'mainnet',
      {
        name: 'evry-dev',
        chainId: 15,
        networkId: 15,
      },
      'constantinople',
    )
    this.provider = web3Instance.givenProvider
    Object.seal(this)
  }
}
