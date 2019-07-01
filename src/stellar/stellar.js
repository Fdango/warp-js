import grpc from 'grpc';
import {loadSync} from '@grpc/proto-loader';
import StellarSDK from 'stellar-sdk';
import path from 'path';

const PROTO_PATH = path.resolve() + '/proto/stellar.proto';
const packageDefinition = loadSync(
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
 * Returns a Stellar client
 * @param {ClientConfig} config - grpc client configuration
 * @return {Stellar}
 */
export function getStellarClient(config) {
  if (!sc) {
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
  constructor(config) {
    StellarSDK.Network.useTestNetwork();
    this.client = new stellar_proto
      .StellarGRPC(config.getHost(), config.getSecure());
  }

  /**
   * Returns a next sequence number for a given address
   * @param {string} address - stellar address to get a sequence number
   **/
  getSequenceNumber(address) {
    return new Promise(
      (resolve, reject) => {
        var chan = this.client.GetSequenceNumber({stellarAddress: address});
        chan.on('data', data => {
          resolve(data);
        });
        chan.on('error', err => {
          reject(err);
        });
      }
    );
  }

  /**
   * Creates a payment operation XDR for given params
   * @param {string} src - a sender's stellar secret which contains the target asset
   * @param {string} amount - amount of an asset to be transfered
   * @param {StellarSDK.Asset} asset - stellar asset to be transfered
   **/
  async createPayment(src, amount, asset) {
    let kp = StellarSDK.Keypair.fromSecret(src);
    let pk = kp.publicKey();

    try {
      let res = await this.getSequenceNumber(pk)
      let account = new StellarSDK.Account(pk, res.sequenceNumber);

      let transaction = new StellarSDK.TransactionBuilder(account, {
        fee: StellarSDK.BASE_FEE
      })
        // add a payment operation to the transaction
        .addOperation(StellarSDK.Operation.payment({
          destination: "GAAQ4EOKRV3O5MC42JPREIUYRCTXUE6JLXWHMETM24AFACXWE54FQATQ",
          asset: asset,
          amount: amount
        }))
        // mark this transaction as valid only forever
        .setTimeout(StellarSDK.TimeoutInfinite)
        .build();
      // sign the transaction
      transaction.sign(kp);
      return transaction.toXDR();
    } catch (e) {
      return e;
    }
  }
}

