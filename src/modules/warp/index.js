import { getStellarClient } from '@/modules/stellar/stellar'
import { getEvryClient } from '@/modules/evrynet/evrynet'
import { getWarpContract } from '@/modules/contract/warp'
import { getTransferClient } from '@/modules/transfer/transfer'
import assetEntity from '@/entities/asset'
import WarpException from '@/exceptions/warp_sdk'
import { warpConfigInstance } from '@/config'

/**
 *
 * @typedef {import('./entities/asset').Asset} Asset
 */

/**
 * @typedef Warp
 */
export default class Warp {
  constructor() {
    this.utils = {
      ...assetEntity,
    }
    this.client = {
      stellar: getStellarClient(warpConfigInstance),
      evry: getEvryClient(warpConfigInstance),
      transfer: getTransferClient(warpConfigInstance),
    }
    this.contract = {
      warp: getWarpContract(warpConfigInstance),
    }
  }

  /**
   * Makes a move asset from stellar to evrynet request
   * @param {Object} payload - a sender's input including the transferring asset and both network account
   * @param {string} payload.evrynetPriv - a sender's evrynet secret which will receive the asset
   * @param {string} payload.stellarPriv - a sender's stellar secret which is holding the asset
   * @param {string} payload.amount - amount of an asset to be transferred
   * @param {Asset}  payload.asset - asset to be transferred
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
            this.contract.warp.newUnlockNativeTx(payload),
          )
        : this.contract.warp.txToHex(
            this.contract.warp.newUnlockTx({
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
   * Makes a move asset from evrynet to stellar request
   * @param {Object} payload - a sender's input including the transferring asset and both network account
   * @param {string} payload.evrynetPriv - a sender's evrynet secret which will receive the asset
   * @param {string} payload.stellarPriv - a sender's stellar secret which is holding the asset
   * @param {string} payload.amount - amount of an asset to be transferred
   * @param {Asset}  payload.asset - asset to be transferred
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
            this.contract.warp.newLockNativeTx(payload),
          )
        : this.contract.warp.txToHex(
            this.contract.warp.newLockTx({
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
