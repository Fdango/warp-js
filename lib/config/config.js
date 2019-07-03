"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _grpc = _interopRequireDefault(require("grpc"));

/**
 *  @typedef {Object} ClientConfig
 *  @property {string} host - grpc host url
 *  @property {boolean} isSecure - grpc secure connection flag
 */
class ClientConfig {
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
      return _grpc.default.credentials.createSsl();
    }

    return _grpc.default.credentials.createInsecure();
  }

}

exports.default = ClientConfig;