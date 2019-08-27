import config from '@/config/config'
const {
  grpc: { DEFAULT_HOST },
} = config

/**
 *  @typedef {Object} GRPCConnector
 *  @property {string} host - grpc host url
 *  @property {boolean} isSecure - grpc secure connection flag
 */
export default class GRPCConnectorEntitiy {
  /**
   * @constructor
   * @param {Object} [options={}] options - is configuration options for grpc entity.
   */
  constructor(options = {}) {
    const { host } = options
    this.host = host || DEFAULT_HOST
  }

  /**
   *	Returns grpc client endpoint
   *  @returns {string} host
   **/
  getHost() {
    return this.host
  }
}
