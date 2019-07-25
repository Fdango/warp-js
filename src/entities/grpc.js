import config from '@/config/config'
import grpc from 'grpc';
const {grpc: {DEFAULT_HOST}} = config

/**
 *  @typedef {Object} GRPCConnector
 *  @property {string} host - grpc host url
 *  @property {boolean} isSecure - grpc secure connection flag
 */
export default class GRPCConnectorEntitiy {

  /**
   * @constructor
   * @param {string} host
   * @param {boolean} isSecure
   */
  constructor({host, isSecure}) {

    this.host = host || DEFAULT_HOST;
    this.isSecure = isSecure || false;
  }

  /**
  *	Returns grpc client endpoint
  **/
  getHost() {
    return this.host;
  }

  /**
  *	Returns grpc client's credentials
  **/
  getSecure() {
    if (this.isSecure) {
      return grpc.credentials.createSsl();
    }
    return grpc.credentials.createInsecure();
  }
}

