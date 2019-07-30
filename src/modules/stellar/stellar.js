import getClientRegistryIntance from '@/interfaces/registries/grpc_client'
import config from '@/config/config'
import StellarSDK from 'stellar-sdk'
import GRPCConnectorEntitiy from '@/entities/grpc'
import StellarException from '@/exceptions/stellar'

const {
  grpc: { STELLAR },
  stellar: { ESCROW_ACCOUNT },
} = config

let sc = []

/**
 *
 * @typedef {import('../../entities/asset').Credit} Credit
 * @typedef {import('grpc').Client} GRPCClient
 */

/**
 * Returns a Stellar client
 * @return {Stellar}
 */
export function getStellarClient(connectionOpts = {}) {
  const key = JSON.stringify(connectionOpts)
  if (!sc[key]) {
    const stellarProto = getClientRegistryIntance(STELLAR)
    const config = new GRPCConnectorEntitiy({
      host: connectionOpts.host,
      isSecure: connectionOpts.isSecure,
    })
    sc[key] = new Stellar(
      new stellarProto.StellarGRPC(config.getHost(), config.getSecure()),
    )
  }
  return sc[key]
}

/**
 * @typedef Stellar
 * @property {GRPCClient} client - grpc client for stellar integration
 */
export class Stellar {
  /**
   * @constructor
   * @param {GRPCClient} client
   */
  constructor(client) {
    StellarSDK.Network.useTestNetwork()
    this.client = client
  }

  /**
   * Returns a next sequence number for a given address
   * @param {string} address - stellar address to get a sequence number
   * @returns {string|StellarException} sequence number
   */
  getSequenceNumber(address) {
    return new Promise((resolve, reject) => {
      const chan = this.client.GetSequenceNumber({ stellarAddress: address })
      chan.on('data', (data) => {
        resolve(data)
      })
      chan.on('error', (err) => {
        reject(new StellarException(null, err.message))
      })
    })
  }

  /**
   * Returns a next sequence number for a given secret
   * @param {string} seed - stellar seed to get a sequence number
   * @returns {string|StellarException}  sequence number
   */
  getSequenceNumberBySecret(seed) {
    return new Promise((resolve, reject) => {
      const kp = StellarSDK.Keypair.fromSecret(seed)
      const chan = this.client.GetSequenceNumber({
        stellarAddress: kp.publicKey(),
      })
      chan.on('data', (data) => {
        resolve(data)
      })
      chan.on('error', (err) => {
        reject(new StellarException(null, err.message))
      })
    })
  }

  /**
   * Creates a payment operation XDR for given params.
   * The tx will be used for the asset moving stellar to evrynet.
   * @param {Object} payload - a payload clients send to create a transaction
   * @param {string} payload.src - source address of transaction
   * @param {string} payload.seq - sequence number of transaction
   * @param {string} payload.amount - amount to be sent
   * @param {Credit} payload.asset - asset type
   */
  async createDepositTx({ src, seq, amount, asset }) {
    return this.newPaymentTx(src, '', ESCROW_ACCOUNT, seq, amount, asset)
  }

  /**
   * Creates a payment operation XDR for given params
   * The tx will be used for the asset moving evrynet to stellar.
   * @param {string} payload - a payload clients send to withdraw a transaction
   * @param {string} payload.src - a sender's stellar secret which will be received the asset
   * @param {string} payload.amount - amount of an asset to be transfered
   * @param {Object} payload.asset - stellar asset to be transfered
   */
  async createWithdrawTx({ src, seq, amount, asset }) {
    return this.newPaymentTx(src, ESCROW_ACCOUNT, '', seq, amount, asset)
  }

  /**
   *
   * @param {string} txSrc - a source of transaction
   * @param {string} opSrc - a source of operation
   * @param {string} opDest - a destination of destination
   * @param {string} seq - sequence number
   * @param {string} amount - amount to do a payment
   * @param {Credit} asset - asset of payment
   * @returns {string|StellarException} xdr or exception
   */
  async newPaymentTx(txSrc, opSrc, opDest, seq, amount, asset) {
    try {
      const kp = StellarSDK.Keypair.fromSecret(txSrc)
      const txPk = kp.publicKey()
      const _opSrc = opSrc || txPk
      const _opDest = opDest || txPk
      const account = new StellarSDK.Account(txPk, seq)
      const transaction = new StellarSDK.TransactionBuilder(account, {
        fee: StellarSDK.BASE_FEE,
      })
        .addOperation(
          StellarSDK.Operation.payment({
            source: _opSrc,
            destination: _opDest,
            asset: asset.asset,
            amount: amount,
          }),
        )
        .setTimeout(StellarSDK.TimeoutInfinite)
        .build()
      transaction.sign(kp)
      return transaction.toXDR()
    } catch (e) {
      return new StellarException(null, e.message)
    }
  }
}
