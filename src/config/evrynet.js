import { web3Instance } from '@/utils'
import Common from 'ethereumjs-common'
export default class EvrynetConfig {
  constructor() {
    this.contractAddress = '0x81e37ac7D0deD9cbc262F9fA0f9637Ced19cfa07'
    this.gasLimit = web3Instance.utils.toHex(2000000)
    this.gasPrice = web3Instance.utils.toHex(
      Number(web3Instance.utils.toWei('1', 'gwei')),
    )
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
