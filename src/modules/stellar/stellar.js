import StellarSDK from 'stellar-sdk'
import StellarException from '@/exceptions/stellar'
import {
  GetSequenceNumberRequest,
  GetBalanceRequest,
  GetTrustlinesRequest,
} from './stellar_pb.js'
import { Asset } from '@/modules/warp/common_pb.js'
import { StellarGRPCClient } from './stellar_grpc_web_pb.js'
import map from 'lodash/map'

let sc

/**
 * @typedef {import('./entities/asset').WhitelistedAsset} WhitelistedAsset
 */

/**
 * Returns a Stellar client
 * @return {Stellar}
 */
export function getStellarClient(config) {
  if (!sc) {
    sc = new Stellar(new StellarGRPCClient(config.grpc.host), config.stellar)
  }
  return sc
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
  constructor(client, config) {
    this.client = client
    this.config = config
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
        reject(new StellarException(null, err.message))
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
   * @param {Object} payload - payload for getting balance
   * @param {string} payload.address - a address of account
   * @param {WhitelistedAsset} payload.asset - asset of payment
   * @returns {string|StellarException} balance
   */
  getBalance({ address, asset }) {
    const grpcAsset = new Asset()
    grpcAsset.setCode(asset.code)
    grpcAsset.setIssuer(asset.issuer)
    grpcAsset.setDecimal(asset.decimal)
    grpcAsset.setTypeid(asset.typeID)
    const grpcRequest = new GetBalanceRequest()
    grpcRequest.setAsset(grpcAsset)
    grpcRequest.setAccountaddress(address)
    return new Promise((resolve, reject) => {
      const chan = this.client.getBalance(grpcRequest, {})
      chan.on('data', (data) => {
        resolve({ balance: data.getBalance() })
      })
      chan.on('error', (err) => {
        reject(new StellarException(null, err.message))
      })
    })
  }

  /**
   * @param {string} accountAddress - a address of account
   * @returns {Array.<StellarAsset>} array of trusted assets
   */
  getTrustlines(accountAddress) {
    const grpcRequest = new GetTrustlinesRequest()
    grpcRequest.setStellaraddress(accountAddress)
    return new Promise((resolve, reject) => {
      const chan = this.client.getTrustlines(grpcRequest, {})
      chan.on('data', (data) => {
        const assets = map(data.getAssetList(), (stellarAsset) => {
          return {
            code: stellarAsset.getCode(),
            issuer: stellarAsset.getIssuer(),
          }
        })
        resolve({ assets })
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
   * @param {string} payload.secret - source address of transaction
   * @param {string} payload.seq - sequence number of transaction
   * @param {string} payload.amount - amount to be sent
   * @param {StellarSDK.Asset} payload.asset - asset type
   */
  async newLockTransaction({ secret, amount, asset }) {
    return this.newPaymentTx(
      secret,
      '',
      this.config.escrowAccount,
      amount,
      asset,
    )
  }

  /**
   * Creates a payment operation XDR for given params
   * The tx will be used for the asset moving evrynet to stellar.
   * @param {string} payload - a payload clients send to withdraw a transaction
   * @param {string} payload.secret - a sender's stellar secret which will be received the asset
   * @param {string} payload.amount - amount of an asset to be transfered
   * @param {StellarSDK.Asset} payload.asset - stellar asset to be transfered
   */
  async newUnlockTransaction({ secret, amount, asset }) {
    return this.newPaymentTx(
      secret,
      this.config.escrowAccount,
      '',
      amount,
      asset,
    )
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
  async newPaymentTx(txSrc, opSrc, opDest, amount, asset) {
    try {
      const kp = StellarSDK.Keypair.fromSecret(txSrc)
      const txPk = kp.publicKey()
      const _opSrc = opSrc || txPk
      const _opDest = opDest || txPk
      const res = await this.getSequenceNumberBySecret(txSrc)
      const account = new StellarSDK.Account(txPk, res.sequenceNumber)
      const transaction = new StellarSDK.TransactionBuilder(account, {
        fee: StellarSDK.BASE_FEE,
        networkPassphrase: this.config.network,
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
