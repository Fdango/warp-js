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
 * @typedef {Object} Stellar
 * @property {Object} client - grpc client for stellar integration
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
   */
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
     * Returns a next sequence number for a given secret
     * @param {string} seed - stellar seed to get a sequence number
     */
  getSequenceNumberBySecret(seed) {
    return new Promise(
      (resolve, reject) => {
        let kp = StellarSDK.Keypair.fromSecret(seed);
        var chan = this.client.GetSequenceNumber({stellarAddress: kp.publicKey()});
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
   * Creates a payment operation XDR for given params.
   * The tx will be used for the asset moving stellar to evrynet.
   * @param {string} src - a sender's stellar secret which contains the target asset
   * @param {string} amount - amount of an asset to be transfered
   * @param {Object} asset - stellar asset to be transfered
   */
  async createDepositTx(src, seq, amount, asset) {
    return this.newPaymentTx(
      src,
      '',
      'GAAQ4EOKRV3O5MC42JPREIUYRCTXUE6JLXWHMETM24AFACXWE54FQATQ',
      seq,
      amount,
      asset
    );
  }

  /**
   * Creates a payment operation XDR for given params
   * The tx will be used for the asset moving evrynet to stellar.
   * @param {string} src - a sender's stellar secret which will be received the asset
   * @param {string} amount - amount of an asset to be transfered
   * @param {Object} asset - stellar asset to be transfered
   */
  async createWithdrawTx(src, seq, amount, asset) {
    return this.newPaymentTx(
      src,
      "GAAQ4EOKRV3O5MC42JPREIUYRCTXUE6JLXWHMETM24AFACXWE54FQATQ",
      '',
      seq,
      amount,
      asset
    );
  }

  async newPaymentTx(txSrc, opSrc, opDest, seq, amount, asset) {
    let kp = StellarSDK.Keypair.fromSecret(txSrc);
    let txPk = kp.publicKey();
    let _opSrc = txPk;
    let _opDest = txPk;
    if (opSrc.length > 0) {
      _opSrc = opSrc
    }
    if (opDest.length > 0) {
      _opDest = opDest;
    }
    try {
      let account = new StellarSDK.Account(txPk, seq);

      let transaction = new StellarSDK.TransactionBuilder(account, {
        fee: StellarSDK.BASE_FEE
      })
        // add a payment operation to the transaction
        .addOperation(StellarSDK.Operation.payment({
          source: _opSrc,
          destination: _opDest,
          asset: asset.asset,
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

