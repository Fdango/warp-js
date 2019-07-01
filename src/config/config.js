import grpc from 'grpc';

/**
 *  @typedef {Object} ClientConfig
 *  @property {string} host - grpc host url
 *  @property {boolean} isSecure - grpc secure connection flag
 */
export default class ClientConfig {

  /**
   * @constructor
   * @param {string} host
   * @param {boolean} isSecure
   */
  constructor(host, isSecure) {
    this.host = host || 'localhost:8080';
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

