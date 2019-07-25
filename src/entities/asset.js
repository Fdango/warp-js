import StellarSDK from 'stellar-sdk'
import Web3 from 'web3'
import config from '@/config/config'
import AssetEntityException from '@/exceptions/asset_entity'

const {
  stellar: { EVRY_ASSET_NAME, EVRY_ASSET_ISSUER_PUB },
} = config

/**
 *	Returns XLM asset
 *	@return {Credit} Lumens(XLM)
 **/
export function getLumensAsset() {
  const web3 = new Web3()
  return new Credit('Lumens', StellarSDK.Asset.native(), web3)
}

/**
 *	Returns Evry coin (Native asset)
 *	@return {Credit} Evry Coint
 **/
export function getEvryAsset() {
  const web3 = new Web3()
  return new Credit(
    'Evry Coin',
    new StellarSDK.Asset(EVRY_ASSET_NAME, EVRY_ASSET_ISSUER_PUB),
    web3,
  )
}

/**
 * @typedef Credit
 * @property {string} name
 * @property {Object} asset
 */
class Credit {
  constructor(name, asset, ethClient) {
    this.name = name
    this.asset = asset
    this.web3 = ethClient
  }

  getHexName() {
    if (!this.name) {
      throw new AssetEntityException(null, 'cannot read name property')
    }
    return this.web3.utils.asciiToHex(this.name)
  }

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
