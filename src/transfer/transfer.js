const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const StellarSdk = require('stellar-sdk');
const StellarBase = require('stellar-base');
const ClientConfig = require('../config/config.js');
const {getStellarClient} = require('../stellar/stellar.js');

StellarSdk.Network.useTestNetwork();

const PROTO_PATH = __dirname + '/../../proto/transfer.proto';
const packageDefinition = protoLoader.loadSync(
  PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
const packageDescriptor = grpc.loadPackageDefinition(packageDefinition);

const transfer_proto = packageDescriptor.transfer;

var tc;

/**
 * returns a Transfer client
 * @param{ClientConfig} config - grpc client configuration
 * @return {Transfer}
 */
function getTransferClient(config) {
  if(!tc) {
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
    this.client = new transfer_proto
      .TransferService(config.getHost(), config.getSecure());
    this.config = config;
  }

  /**
   *  transfers a stellar asset to the Evrynet chain
   *  @param {string} xdr - a stellar payment operation XDR
   *  @param {string} evrynetAddress - a recipient's Evrynet address
   **/
  transfer(xdr, evrynetAddress) {
    return new Promise(
      (resolve, reject) => {
        let chan = this.client.ToEvrynet({
          stellarXDR: xdr,
          evrynetAccount: evrynetAddress,
        });
        chan.on('data',data => {
          resolve(data);
        });
        chan.on('error', err => {
          reject(err);
        });
      }
    );
  }

  /**
   * makes a move asset from stellar to evrynet request
   * @param {string} src - a sender's stellar secret which contains the target asset
   * @param {string} amount - amount of an asset to be transfered
   * @param {StellarBase.Asset} asset - stellar asset to be transfered
   * @param {string} evrynetAddress - a recipient's Evrynet address
   */
  async ToEvrynet(src, amount, asset, evrynetAddress) {
    try{
      let paymentXDR = await getTransferClient(this.config)
        .createPayment(src, amount, asset);
      return await this.transfer(paymentXDR, evrynetAddress);
    } catch(e){
      return e;
    }
  }
}

module.exports = {getTransferClient};
