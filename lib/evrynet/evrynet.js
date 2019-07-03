"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEvryClient = getEvryClient;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _grpc = _interopRequireDefault(require("grpc"));

var _protoLoader = require("@grpc/proto-loader");

var _web = _interopRequireDefault(require("web3"));

const PROTO_PATH = _path.default.resolve() + '/proto/evrynet.proto';
const packageDefinition = (0, _protoLoader.loadSync)(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const packageDescriptor = _grpc.default.loadPackageDefinition(packageDefinition);

const evrynet_proto = packageDescriptor.evrynet;
var ec;
/**
 * Returns a Stellar client
 * @param {ClientConfig} config - grpc client configuration
 * @return {Evrynet}
 */

function getEvryClient(config) {
  if (!ec) {
    ec = new Evrynet(config);
  }

  return ec;
}
/**
 * @typedef {Object} Evrynet
 */


class Evrynet {
  /**
   * @constructor
   * @param {ClientConfig} config
   */
  constructor(config) {
    this.client = new evrynet_proto.EvrynetGRPC(config.getHost(), config.getSecure());
  }
  /**
   * Creates a new warp contract instance
   * @return {Object} warp contract
   */


  newWarpContract() {
    let web3 = new _web.default();

    let abiPath = _path.default.resolve();

    let abi = _fs.default.readFileSync(abiPath + "/abi/abi.json");

    return new web3.eth.Contract(JSON.parse(abi, "address"));
  }
  /**
   * Returns a next sequence number for a given address
   * @param {string} address - evrynet address to get a nonce
   */


  getNonce(address) {
    return new Promise((resolve, reject) => {
      var chan = this.client.GetNonce({
        evrynetAddress: address
      });
      chan.on('data', data => {
        resolve(data);
      });
      chan.on('error', err => {
        reject(err);
      });
    });
  }

}