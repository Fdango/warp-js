import { getStellarClient } from '@/modules/stellar/stellar'
import { getEvryClient } from '@/modules/evrynet/evrynet'
import { getWarpContract } from '@/modules/contract/warp'
import { getTransferClient } from '@/modules/transfer/transfer'
import assetEntity from '@/entities/asset'
import WarpException from '@/exceptions/warp_sdk'

/**
 *
 * @typedef {import('./entities/asset').Asset} Asset
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
   * Makes a move asset from evrynet to stellar request
   * @param {string} evrynetPriv - a sender's evrynet secret which will receive the asset
   * @param {string} stellarPriv - a sender's stellar secret which is holding the asset
   * @param {string} amount - amount of an asset to be transferred
   * @param {Asset} asset - stellar asset to be transferred
   * @returns {Object|WarpException} - to evrynet response
   */
  async toEvrynet({ evrynetPriv, stellarPriv, amount, asset }) {
    try {
      const whitelistedAsset = asset.isNative()
        ? asset
        : await this.client.evry.getWhitelistAssetByCode(asset)
      if (!whitelistedAsset) {
        throw new WarpException(null, 'Whitelisted asset not found')
      }
      // instanciate stellar client
      const res = await this.client.stellar.getSequenceNumberBySecret(
        stellarPriv,
      )
      // make a stellar withdraw from escrow
      const stellarTx = await this.client.stellar.createDepositTx({
        src: stellarPriv,
        seq: res.sequenceNumber,
        amount,
        asset: whitelistedAsset.toStellarFormat(),
      })
      const nonceRes = await this.client.evry.getNonceFromPriv(evrynetPriv)
      // make a lock asset msg call
      const payload = {
        amount,
        priv: evrynetPriv,
        nonce: Number(nonceRes.nonce),
      }
      const evrynetTx = whitelistedAsset.isNative()
        ? this.contract.warp.txToHex(
            this.contract.warp.newNativeUnlockTx(payload),
          )
        : this.contract.warp.txToHex(
            this.contract.warp.newCreditUnlockTx({
              ...payload,
              asset: whitelistedAsset,
            }),
          )
      // make a transfer request
      return await this.client.transfer.toEvrynet(evrynetTx, stellarTx)
    } catch (e) {
      throw new WarpException(
        null,
        e.toString(),
        'Unable to move the asset to Evrynet',
      )
    }
  }

  /**
   * Makes a move asset from stellar to evrynet request
   * @param {string} evrynetPriv - a sender's evrynet secret which is holding the target asset
   * @param {string} stellarPriv - a sender's stellar secret which will receive the asset
   * @param {string} amount - amount of an asset to be transferred
   * @param {Asset} asset - stellar asset to be transferred
   * @returns {Object|WarpException} - to stellar response
   */
  async toStellar({ evrynetPriv, stellarPriv, amount, asset }) {
    try {
      const whitelistedAsset = asset.isNative()
        ? asset
        : await this.client.evry.getWhitelistAssetByCode(asset)
      if (!whitelistedAsset) {
        throw new WarpException(null, 'Whitelisted asset not found')
      }
      // instanciate stellar client
      const res = await this.client.stellar.getSequenceNumberBySecret(
        stellarPriv,
      )
      // make a stellar withdraw from escrow
      const stellarTx = await this.client.stellar.createWithdrawTx({
        src: stellarPriv,
        seq: res.sequenceNumber,
        amount,
        asset: whitelistedAsset.toStellarFormat(),
      })
      const nonceRes = await this.client.evry.getNonceFromPriv(evrynetPriv)
      // make a lock asset msg call
      const payload = {
        amount,
        priv: evrynetPriv,
        nonce: Number(nonceRes.nonce),
      }
      const evrynetTx = whitelistedAsset.isNative()
        ? this.contract.warp.txToHex(
            this.contract.warp.newNativeLockTx(payload),
          )
        : this.contract.warp.txToHex(
            this.contract.warp.newCreditLockTx({
              ...payload,
              asset: whitelistedAsset,
            }),
          )
      // make a transfer request
      return await this.client.transfer.toStellar(evrynetTx, stellarTx)
    } catch (e) {
      throw new WarpException(
        null,
        e.toString(),
        'Unable to move the asset to Stellar',
      )
    }
  }
}
