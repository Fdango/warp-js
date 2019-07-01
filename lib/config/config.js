"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _grpc = _interopRequireDefault(require("grpc"));

/**
 *  @typedef {Object} ClientConfig
 *  @property {string} host - grpc host url
 *  @property {boolean} isSecure - grpc secure connection flag
 */
var ClientConfig =
/*#__PURE__*/
function () {
  /**
   * @constructor
   * @param {string} host
   * @param {boolean} isSecure
   */
  function ClientConfig(host, isSecure) {
    (0, _classCallCheck2["default"])(this, ClientConfig);
    this.host = host || 'localhost:8080';
    this.isSecure = isSecure || false;
  }

  (0, _createClass2["default"])(ClientConfig, [{
    key: "getHost",
    value: function getHost() {
      return this.host;
    }
  }, {
    key: "getSecure",
    value: function getSecure() {
      if (this.isSecure) {
        return _grpc["default"].credentials.createSsl();
      }

      return _grpc["default"].credentials.createInsecure();
    }
  }]);
  return ClientConfig;
}();

exports["default"] = ClientConfig;