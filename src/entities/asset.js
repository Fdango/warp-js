import StellarSDK from 'stellar-sdk'
import config from '@/config/config'
import AssetEntityException from '@/exceptions/asset_entity'
import { web3Instance } from '@/utils'

const {
  stellar: { EVRY_ASSET_NAME, EVRY_ASSET_ISSUER_PUB },
} = config

/**
 * @typedef {import('web3')} Web3
 */

/**
 *	Returns XLM asset.
 *	@return {Asset} - Lumens(XLM).
 **/
export function getLumensAsset() {
  const asset = StellarSDK.Asset.native()
  return new Asset({
    code: asset.getCode(),
    issuer: asset.getIssuer(),
  })
}

/**
 *	Returns Evry coin (Native asset).
 *	@return {Asset} - Evry Coin.
 **/
export function getEvryAsset() {
  return new Asset({
    code: EVRY_ASSET_NAME,
    issuer: EVRY_ASSET_ISSUER_PUB,
  })
}

/**
 * Class representing asset.
 * @typedef Asset
 * @property {Web3} web3 - web3 utils
 * @property {string} issuer - asset's issuer
 * @property {string} code - asset's code
 */
export class Asset {
  /**
   * Constructor for creating Credit.
   * @class
   * @param {Object} payload - asset fields
   * @param {string} payload.code - asset's code
   * @param {string} payload.issuer - asset's issuer
   */
  constructor({ code, issuer }) {
    this.code = code
    this.issuer = issuer
  }
  /**
   * get formatted asset's issuer
   * @returns {string}
   */
  getIssuer() {
    return this.issuer || ''
  }

  /**
   * get formatted asset's code
   * @returns {string}
   */
  getCode() {
    return this.code
  }

  /**
   * Map to stellar asset object
   * @returns {StellarSDK.Asset} - stellar asset object
   */
  toStellarFormat() {
    return new StellarSDK.Asset(this.code, this.issuer)
  }

  /**
   * Get asset's id in hex-encoded format.
   * @returns {string} - hex-encoded of asset name.
   */
  getID() {
    if (!this.code) {
      throw new AssetEntityException(null, 'cannot read name property')
    }
    const key = `${this.code},${this.issuer || ''}`
    return web3Instance.utils.keccak256(key)
  }

  /**
   * Check if this asset is native.
   * @return {boolean} - the result wheter this asset if native or not.
   */
  isNative() {
    return (
      this.code === EVRY_ASSET_NAME && this.issuer === EVRY_ASSET_ISSUER_PUB
    )
  }
}

/**
 * Class representing asset with extended decimal.
 * After getWhitelistAssets function the decimal in smartcontract whitelist assets will be shown up.
 * So, we declare its decimal along with former asset in this new entity.
 * @typedef WhitelistedAsset
 * @augments Asset
 * @property {string} decimal - decimal of asset
 */
export class WhitelistedAsset extends Asset {
  /**
   * Constructor for creating Credit.
   * @class
   * @param {Object} payload - asset fields
   * @param {string} payload.code - asset's code
   * @param {string} payload.issuer - asset's issuer
   * @param {string} payload.decimal - asset's decimal
   */
  constructor({ code, issuer, decimal }) {
    super({ code, issuer })
    this.decimal = decimal
  }

  /**
   * get decimal of an asset
   * @returns {number}
   */
  getDecimal() {
    return this.decimal
  }
}

export default {
  Asset,
  WhitelistedAsset,
  getEvryAsset,
  getLumensAsset,
}
