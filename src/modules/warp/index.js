import { getStellarClient } from '@/modules/stellar/stellar'
import { getEvryClient } from '@/modules/evrynet/evrynet'
import { getWarpContract } from '@/modules/contract/warp'
import { getTransferClient } from '@/modules/transfer/transfer'
import assetEntity from '@/entities/asset'
import WarpException from '@/exceptions/warp_sdk'

/**
 *
 * @typedef {import('./entities/asset').Credit} Asset
 */

/**
 * @typedef Warp
 */
export default class Warp {
  constructor(connectionOpts = {}) {
    this.utils = {
      ...assetEntity,
    }
    this.config = connectionOpts
    this.client = {
      stellar: getStellarClient(this.config),
      evry: getEvryClient(this.config),
      transfer: getTransferClient(this.config),
    }
    this.contract = {
      warp: getWarpContract(),
    }
  }

  /**
   * Makes a move asset from stellar to evrynet request
   * @param {Object} payload - a sender's stellar secret which holds the target asset
   * @param {string} payload.src - amount of an asset to be transfered
   * @param {string} payload.amount - amount of an asset to be transfered
   * @param {Asset} payload.asset - stellar asset to be transfered
   * @param {string} payload.evrynetAddress - a recipient's Evrynet address
   * @returns {Object|WarpException} - to evrynet response
   */
  async toEvrynet({ src, amount, asset, evrynetAddress }) {
    try {
      const res = await this.client.stellar.getSequenceNumberBySecret(src)
      const paymentXDR = await this.client.stellar.createDepositTx({
        src,
        seq: res.sequenceNumber,
        amount,
        asset,
      })
      return await this.client.transfer.toEvrynet(paymentXDR, evrynetAddress)
    } catch (e) {
      throw new WarpException(
        null,
        e.message,
        'Unable to move the asset to evrynet',
      )
    }
  }

  /**
   * Makes a move asset from evrynet to stellar request
   * @param {string} evrynetPriv - a sender's evrynet secret which holds the target asset
   * @param {string} stellarPriv - a sender's stellar secret which will recive the asset
   * @param {string} amount - amount of an asset to be transfered
   * @param {Asset} asset - stellar asset to be transfered
   * @returns {Object|WarpException} - to evrynet response
   */
  async toStellar({ evrynetPriv, stellarPriv, amount, asset }) {
    try {
      // instanciate stellar client
      const res = await this.client.stellar.getSequenceNumberBySecret(
        stellarPriv,
      )
      // make a stellar withdraw from escrow
      const stellarTx = await this.client.stellar.createWithdrawTx({
        src: stellarPriv,
        seq: res.sequenceNumber,
        amount,
        asset,
      })
      const nonceRes = await this.client.evry.getNonceFromPriv(evrynetPriv)
      // make a lock asset msg call
      let tx
      if (asset.isNative()) {
        tx = this.contract.warp.newNativeLockTx(
          amount,
          evrynetPriv,
          Number(nonceRes.nonce),
        )
      } else {
        tx = this.contract.warp.newCreditLockTx(
          asset,
          amount,
          evrynetPriv,
          Number(nonceRes.nonce),
        )
      }
      let evrynetTx = this.contract.warp.txToHex(tx)
      // make a transfer request
      return await this.client.transfer.toStellar(evrynetTx, stellarTx)
    } catch (e) {
      throw new WarpException(
        null,
        e.message,
        'Unable to move the asset to stellar',
      )
    }
  }
}