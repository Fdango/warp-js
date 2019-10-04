import { StellarConfig, GRPCConfig, EvrynetConfig } from '@/config'
import { mergeObject, initWeb3Instance } from '@/utils'

class WarpConfig {
  constructor() {
    this.stellar = new StellarConfig()
    this.grpc = new GRPCConfig()
    this.evrynet = new EvrynetConfig()
    Object.seal(this)
  }
}

export let warpConfigInstance = new WarpConfig()

export const initWarpConfig = (configuration) => {
  warpConfigInstance = mergeObject(warpConfigInstance, configuration)
  initWeb3Instance(warpConfigInstance.evrynet.provider)
}

export default WarpConfig
