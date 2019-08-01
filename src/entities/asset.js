import StellarSDK from 'stellar-sdk'
import Web3 from 'web3'
import config from '@/config/config'
import AssetEntityException from '@/exceptions/asset_entity'

const {
  stellar: { EVRY_ASSET_NAME, EVRY_ASSET_ISSUER_PUB },
} = config

/**
 *	Returns XLM asset.
 *	@return {Credit} - Lumens(XLM).
 **/
export function getLumensAsset() {
  return new Credit('Lumens', StellarSDK.Asset.native())
}

/**
 *	Returns Evry coin (Native asset).
 *	@return {Credit} - Evry Coin.
 **/
export function getEvryAsset() {
  return new Credit(
    'Evry Coin',
    new StellarSDK.Asset(EVRY_ASSET_NAME, EVRY_ASSET_ISSUER_PUB),
  )
}

/**
 * Class representing credit.
 * @typedef Credit
 * @property {string} name
 * @property {Object} asset
 */
export class Credit {
  /**
   * Constructor for creating Credit.
   * @class
   * @param {string} name - credit name.
   * @param {StellarSDK.Asset} asset - stellar asset.
   */
  constructor(name, asset) {
    this.name = name
    this.asset = asset
    this.web3 = new Web3()
  }

  /**
   * Get name in hex-encoded format.
   * @returns {string} - hex-encoded of asset name.
   */
  getHexName() {
    if (!this.name) {
      throw new AssetEntityException(null, 'cannot read name property')
    }
    return this.web3.utils.asciiToHex(this.name)
  }

  /**
   * Check if this asset is native.
   * @return {boolean} - the result wheter this asset if native or not.
   */
  isNative() {
    return (
      this.asset.getCode() === EVRY_ASSET_NAME &&
      this.asset.getIssuer() === EVRY_ASSET_ISSUER_PUB
    )
  }
}

export default {
  getLumensAsset,
  getEvryAsset,
}
