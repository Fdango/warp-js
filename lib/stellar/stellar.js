"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStellarClient = getStellarClient;

var _grpc = _interopRequireDefault(require("grpc"));

var _protoLoader = require("@grpc/proto-loader");

var _stellarSdk = _interopRequireDefault(require("stellar-sdk"));

var _path = _interopRequireDefault(require("path"));

const PROTO_PATH = _path.default.resolve() + '/proto/stellar.proto';
const packageDefinition = (0, _protoLoader.loadSync)(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const packageDescriptor = _grpc.default.loadPackageDefinition(packageDefinition);

const stellar_proto = packageDescriptor.stellar;
var sc;
/**
 * Returns a Stellar client
 * @param {ClientConfig} config - grpc client configuration
 * @return {Stellar}
 */

function getStellarClient(config) {
  if (!sc) {
    sc = new Stellar(config);
  }

  return sc;
}
/**
 * @typedef {Object} Stellar
 * @property {Object} client - grpc client for stellar integration
 */


class Stellar {
  /**
   * @constructor
   * @param {ClientConfig} config
   */
  constructor(config) {
    _stellarSdk.default.Network.useTestNetwork();

    this.client = new stellar_proto.StellarGRPC(config.getHost(), config.getSecure());
  }
  /**
   * Returns a next sequence number for a given address
   * @param {string} address - stellar address to get a sequence number
   */


  getSequenceNumber(address) {
    return new Promise((resolve, reject) => {
      var chan = this.client.GetSequenceNumber({
        stellarAddress: address
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
   * Creates a payment operation XDR for given params
   * @param {string} src - a sender's stellar secret which contains the target asset
   * @param {string} amount - amount of an asset to be transfered
   * @param {StellarSDK.Asset} asset - stellar asset to be transfered
   */


  async createPayment(src, amount, asset) {
    let kp = _stellarSdk.default.Keypair.fromSecret(src);

    let pk = kp.publicKey();

    try {
      let res = await this.getSequenceNumber(pk);
      let account = new _stellarSdk.default.Account(pk, res.sequenceNumber);
      let transaction = new _stellarSdk.default.TransactionBuilder(account, {
        fee: _stellarSdk.default.BASE_FEE
      }) // add a payment operation to the transaction
      .addOperation(_stellarSdk.default.Operation.payment({
        destination: "GAAQ4EOKRV3O5MC42JPREIUYRCTXUE6JLXWHMETM24AFACXWE54FQATQ",
        asset: asset,
        amount: amount
      })) // mark this transaction as valid only forever
      .setTimeout(_stellarSdk.default.TimeoutInfinite).build(); // sign the transaction

      transaction.sign(kp);
      return transaction.toXDR();
    } catch (e) {
      return e;
    }
  }

}