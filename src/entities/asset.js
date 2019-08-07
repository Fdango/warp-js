import StellarSDK from 'stellar-sdk'
import Web3 from 'web3'
import config from '@/config/config'
import AssetEntityException from '@/exceptions/asset_entity'

const {
  stellar: { EVRY_ASSET_NAME, EVRY_ASSET_ISSUER_PUB },
} = config

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
 * Class representing credit.
 * @typedef Asset
 * @property {string} name
 * @property {Object} asset
 */
export class Asset {
  constructor({ code, issuer }) {
    this.web3 = new Web3()
    this.code = code
    this.issuer = issuer
  }

  /**
   * Map to stellar asset object
   * @returns {StellarSDK.Asset} - stellar asset object
   */
  toStellarFormat() {
    return new StellarSDK.Asset(this.code, this.issuer)
  }

  /**
   * Get name in hex-encoded format.
   * @returns {string} - hex-encoded of asset name.
   */
  getHexKey() {
    if (!this.code) {
      throw new AssetEntityException(null, 'cannot read name property')
    }
    const key = `${this.code},${this.issuer || ''}`
    return this.web3.utils.keccak256(key)
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
 * Class representing credit.
 * @typedef WhitelistedAsset
 * @property {string} name
 * @property {Object} asset
 */
export class WhitelistedAsset extends Asset {
  /**
   * Constructor for creating Credit.
   * @class
   * @param {string} name - credit name.
   * @param {StellarSDK.Asset} asset - stellar asset.
   */
  constructor({ code, issuer, decimal }) {
    super({ code, issuer })
    this.decimal = decimal
  }
}

export default {
  Asset,
  WhitelistedAsset,
  getEvryAsset,
  getLumensAsset,
}
