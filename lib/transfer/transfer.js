"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransferClient = getTransferClient;

var _grpc = _interopRequireDefault(require("grpc"));

var _protoLoader = require("@grpc/proto-loader");

var _path = _interopRequireDefault(require("path"));

const PROTO_PATH = _path.default.resolve() + '/proto/transfer.proto';
const packageDefinition = (0, _protoLoader.loadSync)(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const packageDescriptor = _grpc.default.loadPackageDefinition(packageDefinition);

const transfer_proto = packageDescriptor.transfer;
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


class Transfer {
  /**
   * @constructor
   * @param {ClientConfig} config
   */
  constructor(config) {
    this.client = new transfer_proto.TransferGRPC(config.getHost(), config.getSecure());
    this.config = config;
  }
  /**
   *  Transfers a stellar asset to the Evrynet chain
   *  @param {string} xdr - a stellar payment operation XDR
   *  @param {string} evrynetAddress - a recipient's Evrynet address
   **/


  ToEvrynet(xdr, evrynetAddress) {
    return new Promise((resolve, reject) => {
      let chan = this.client.ToEvrynet({
        stellarXDR: xdr,
        evrynetAccount: evrynetAddress
      });
      chan.on('data', data => {
        resolve(data);
      });
      chan.on('error', err => {
        reject(err);
      });
    });
  }
  /**
     *  Transfers a stellar asset to the Evrynet chain
     *  @param {string} xdr - a stellar payment operation XDR
     *  @param {string} evrynetAddress - a recipient's Evrynet address
     **/


  ToStellar(evRawTx, stXDR) {
    return new Promise((resolve, reject) => {
      let chan = this.client.ToStellar({
        evrynetRawTx: evRawTx,
        stellarXDR: stXDR
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