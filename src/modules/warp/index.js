import { getStellarClient } from '@/modules/stellar/stellar'
import { getEvryClient } from '@/modules/evrynet/evrynet'
import { getTransferClient } from '@/modules/transfer/transfer'
import { getNetClient } from '@/modules/net/net'
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
      net: getNetClient(warpConfigInstance),
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
      const whitelistedAsset = await this.client.evry.getWhitelistAssetByCode(
        asset,
      )
      if (!whitelistedAsset) {
        throw new WarpException(null, 'Whitelisted asset not found')
      }
      // make a stellar deposit from escrow
      const stellarTx = await this.client.stellar.newLockTransaction({
        secret: stellarPriv,
        amount,
        asset: whitelistedAsset.toStellarFormat(),
      })
      // make a lock asset msg call
      const payload = {
        amount,
        secret: evrynetPriv,
      }
      const evrynetTx = this.client.evry.txToHex(
        await this.client.evry.newUnlockTx({
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
      const whitelistedAsset = await this.client.evry.getWhitelistAssetByCode(
        asset,
      )
      if (!whitelistedAsset) {
        throw new WarpException(null, 'Whitelisted asset not found')
      }
      // make a stellar withdraw from escrow
      const stellarTx = await this.client.stellar.newUnlockTransaction({
        secret: stellarPriv,
        amount,
        asset: whitelistedAsset.toStellarFormat(),
      })
      // make a lock asset msg call
      const payload = {
        amount,
        secret: evrynetPriv,
      }
      const evrynetTx = this.client.evry.txToHex(
        await this.client.evry.newLockTx({
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
