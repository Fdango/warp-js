import { StellarConfig, GRPCConfig, EvrynetConfig } from '@/config'
import { initWeb3Instance } from '@/utils'
import merge from 'lodash/merge'

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
  warpConfigInstance = merge(warpConfigInstance, configuration)
  initWeb3Instance(warpConfigInstance.evrynet.provider)
}

export default WarpConfig
