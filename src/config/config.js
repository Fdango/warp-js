const grpc = require('grpc');

/*
 *  @typedef {Object} ClientConfig
 *  @property {string} host - grpc host url
 *  @property {boolean} isSecure - grpc secure connection flag
 */
class ClientConfig {

  /*
   * @constructor
   * @param {string} host
   * @param {boolean} isSecure
   */
  constructor(host, isSecure){
    this.host = host || 'localhost:8080';
    this.isSecure = isSecure || false;
  }

  getHost() {
    return this.host;
  }

  getSecure() {
    if(this.isSecure) {
      return grpc.credentials.createSsl();
    } 
    return grpc.credentials.createInsecure();
  }
}

module.exports = ClientConfig;
