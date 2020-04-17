import StellarSDK from 'stellar-sdk'
import { warpConfigInstance } from '@/config'

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
    code: warpConfigInstance.stellar.asset.evry.name,
    issuer: warpConfigInstance.stellar.issuer,
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
   * @param {string} payload.typeID - asset's type id
   */
  constructor({ code, issuer, decimal, typeID, creditOrigin }) {
    super({ code, issuer })
    this.decimal = decimal
    this.typeID = typeID
    this.creditOrigin = creditOrigin
  }

  static get NATIVE_ASSET() {
    return 1
  }

  static get STELLAR_CREDIT() {
    return 2
  }

  static get EVRYNET_CREDIT() {
    return 3
  }

  /**
   * get decimal of an asset
   * @returns {number}
   */
  getDecimal() {
    return this.decimal
  }

  getTypeid() {
    return this.typeID
  }

  getCreditOrigin() {
    return this.creditOrigin
  }
}

export default {
  Asset,
  WhitelistedAsset,
  getEvryAsset,
  getLumensAsset,
}
