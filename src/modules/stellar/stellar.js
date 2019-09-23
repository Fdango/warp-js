import config from '@/config/config'
import StellarSDK from 'stellar-sdk'
import GRPCConnectorEntity from '@/entities/grpc'
import StellarException from '@/exceptions/stellar'
import { GetSequenceNumberRequest, GetBalanceRequest } from './stellar_pb.js'
import { Asset } from '../warp/common_pb.js'
import { StellarGRPCClient } from './stellar_grpc_web_pb.js'

const {
  stellar: { ESCROW_ACCOUNT, NETWORK },
} = config

let sc = []

/**
 * @typedef {import('./entities/asset').WhitelistedAsset} WhitelistedAsset
 */

/**
 * Returns a Stellar client
 * @return {Stellar}
 */
export function getStellarClient(connectionOpts = {}) {
  const key = JSON.stringify(connectionOpts)
  if (!sc[key]) {
    const config = new GRPCConnectorEntity({
      host: connectionOpts.host,
    })
    sc[key] = new Stellar(new StellarGRPCClient(`http://${config.host}`))
  }
  return sc[key]
}

/**
 * @typedef Stellar
 * @property {StellarGRPCClient} client - grpc client for stellar integration
 */
export class Stellar {
  /**
   * @constructor
   * @param {StellarGRPCClient} client
   */
  constructor(client) {
    NETWORK
    this.client = client
  }

  /**
   * Returns a next sequence number for a given address
   * @param {string} address - stellar address to get a sequence number
   * @returns {Object|StellarException} sequence number
   */
  getSequenceNumber(address) {
    const request = new GetSequenceNumberRequest()
    request.setStellaraddress(address)
    return new Promise((resolve, reject) => {
      const chan = this.client.getSequenceNumber(request, {})
      chan.on('data', (data) => {
        resolve({
          sequenceNumber: data.getSequencenumber(),
        })
      })
      chan.on('error', (err) => {
        reject(new StellarException(null, err.toString()))
      })
    })
  }

  /**
   * Returns a next sequence number for a given secret
   * @param {string} seed - stellar seed to get a sequence number
   * @returns {Object|StellarException}  sequence number
   */
  async getSequenceNumberBySecret(seed) {
    const kp = StellarSDK.Keypair.fromSecret(seed)
    try {
      const result = await this.getSequenceNumber(kp.publicKey())
      return result
    } catch (e) {
      new StellarException(null, e.toString())
    }
  }

  /**
   * @param {string} accountAddress - a address of account
   * @param {WhitelistedAsset} asset - asset of payment
   * @returns {string|StellarException} balance
   */
  getAccountBalance(accountAddress, asset) {
    const grpcAsset = new Asset()
    grpcAsset.setCode(asset.code)
    grpcAsset.setIssuer(asset.issuer)
    grpcAsset.setDecimal(asset.decimal)
    const grpcRequest = new GetBalanceRequest()
    grpcRequest.setAsset(grpcAsset)
    grpcRequest.setAccountaddress(accountAddress)
    return new Promise((resolve, reject) => {
      const chan = this.client.getBalance(grpcRequest, {})
      chan.on('data', (data) => {
        resolve({ balance: data.getBalance() })
      })
      chan.on('error', (err) => {
        reject(new StellarException(null, err.toString()))
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
   * @param {StellarSDK.Asset} payload.asset - asset type
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
   * @param {StellarSDK.Asset} payload.asset - stellar asset to be transfered
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
   * @param {StellarSDK.Asset} asset - asset of payment
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
        networkPassphrase: NETWORK,
      })
        .addOperation(
          StellarSDK.Operation.payment({
            source: _opSrc,
            destination: _opDest,
            asset,
            amount: amount,
          }),
        )
        .setTimeout(StellarSDK.TimeoutInfinite)
        .build()
      transaction.sign(kp)
      return transaction.toXDR()
    } catch (e) {
      return new StellarException(null, e.toString())
    }
  }

  /**
   *
   * @param {string} privateKey - private key
   * @returns {string} public key
   */
  getPublickeyFromPrivateKey(privateKey = '') {
    const kp = StellarSDK.Keypair.fromSecret(privateKey)
    const publicKey = kp.publicKey()
    return publicKey
  }
}

export default {
  Stellar,
  getStellarClient,
}
