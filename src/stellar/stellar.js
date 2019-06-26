const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const StellarSdk = require('stellar-sdk');
const StellarBase = require('stellar-base');
const ClientConfig = require('../config/config.js');

StellarSdk.Network.useTestNetwork();

const PROTO_PATH = __dirname + '/../../proto/stellar.proto';
const packageDefinition = protoLoader.loadSync(
  PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
const packageDescriptor = grpc.loadPackageDefinition(packageDefinition);

const stellar_proto = packageDescriptor.stellar;

var sc;

/**
 * returns a Stellar client
 * @param {ClientConfig} config - grpc client configuration
 * @return {Stellar}
 */
function getStellarClient(config) {
  if(!sc){
    sc = new Stellar(config);
  }
  return sc;
}

/**
 *  @typedef {Object} Stellar
 *  @property {Object} client - grpc client for stellar integration
 */
class Stellar {

  /**
   * @constructor
   * @param {ClientConfig} config
   */
  constructor(config){
    this.client = new stellar_proto
      .StellarService(config.getHost(), config.getSecure());;
  }

  /**
   * gets a next sequence number for a given address
   * @param{string} address - stellar address to get a sequence number
   **/
  getSequenceNumber(address) {
    return new Promise(
      (resolve, reject) => {
        var chan = this.client.GetNextSequenceNumber({stellarAddress: address});
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
   * creates a payment operation XDR for given params
   * @param {string} src - a sender's stellar secret which contains the target asset
   * @param {string} amount - amount of an asset to be transfered
   * @param {StellarBase.Asset} asset - stellar asset to be transfered
   **/
  async createPayment(src, amount, asset) {
    let kp = StellarBase.Keypair.fromSecret(src);
    let pk = kp.publicKey();

    try{
      let res = await this.getSequenceNumber(pk)
      let account = new StellarBase.Account(pk, res.sequenceNumber);

      let transaction = new StellarBase.TransactionBuilder(account, {
        fee: StellarBase.BASE_FEE
      })
      // add a payment operation to the transaction
        .addOperation(StellarBase.Operation.payment({
          destination: "GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW",
          asset: asset,
          amount: amount
        }))
      // mark this transaction as valid only forever
        .setTimeout(StellarBase.TimeoutInfinite)
        .build();
      // sign the transaction
      transaction.sign(kp);
      return transaction.toXDR();
    } catch(e){
      return e;
    }
  }
}

module.exports = {getStellarClient};
