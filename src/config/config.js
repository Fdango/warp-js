import { StellarConfig, GRPCConfig, EvrynetConfig } from '@/config'
import { mergeObject, initWeb3Instance } from '@/utils'

export default class RootConfig {
  constructor() {
    this.stellar = new StellarConfig()
    this.grpc = new GRPCConfig()
    this.evrynet = new EvrynetConfig()
    Object.seal(this)
  }
}

export let rootConfigInstance = new RootConfig()

export const initRootConfig = (configuration) => {
  rootConfigInstance = mergeObject(rootConfigInstance, configuration)
  initWeb3Instance(rootConfigInstance.evrynet.provider)
}
