"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransferClient = getTransferClient;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _grpc = _interopRequireDefault(require("grpc"));

var _protoLoader = require("@grpc/proto-loader");

var _path = _interopRequireDefault(require("path"));

var PROTO_PATH = _path["default"].resolve() + '/proto/transfer.proto';
var packageDefinition = (0, _protoLoader.loadSync)(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

var packageDescriptor = _grpc["default"].loadPackageDefinition(packageDefinition);

var transfer_proto = packageDescriptor.transfer;
var tc;
/**
 * Returns a Transfer client
 * @param {ClientConfig} config - grpc client configuration
 * @return {Transfer}
 */

function getTransferClient(config) {
  if (!tc) {
    tc = new Transfer(config);
  }

  return tc;
}
/**
 *  @typedef {Object} Transfer
 *  @property {ClientConfig} config - grpc client config
 *  @property {Object} client - grpc client for transfer
 */


var Transfer =
/*#__PURE__*/
function () {
  /**
   * @constructor
   * @param {ClientConfig} config
   */
  function Transfer(config) {
    (0, _classCallCheck2["default"])(this, Transfer);
    this.client = new transfer_proto.TransferService(config.getHost(), config.getSecure());
    this.config = config;
  }
  /**
   *  Transfers a stellar asset to the Evrynet chain
   *  @param {string} xdr - a stellar payment operation XDR
   *  @param {string} evrynetAddress - a recipient's Evrynet address
   **/


  (0, _createClass2["default"])(Transfer, [{
    key: "transfer",
    value: function transfer(xdr, evrynetAddress) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var chan = _this.client.ToEvrynet({
          stellarXDR: xdr,
          evrynetAccount: evrynetAddress
        });

        chan.on('data', function (data) {
          resolve(data);
        });
        chan.on('error', function (err) {
          reject(err);
        });
      });
    }
  }]);
  return Transfer;
}();