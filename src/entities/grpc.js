import config from '@/config/config'
import grpc from 'grpc'
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
    const { host, isSecure } = options
    this.host = host || DEFAULT_HOST
    this.isSecure = isSecure || false
  }

  /**
   *	Returns grpc client endpoint
   *  @returns {string} host
   **/
  getHost() {
    return this.host
  }

  /**
   * Returns grpc client's credentials
   * @returns {grpc.ChannelCredentials} channel credentials
   **/
  getSecure() {
    if (this.isSecure) {
      return grpc.credentials.createSsl()
    }
    return grpc.credentials.createInsecure()
  }
}
