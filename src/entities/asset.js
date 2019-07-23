import StellarSDK from 'stellar-sdk';
import Web3 from 'web3';
import {stellarEVRYAsset, stellarEVRYAssetIssuer} from '@/config/stellar/asset'
const web3 = new Web3();

/**
*	Returns XLM asset
*	@return {Credit} Lumens(XLM)
**/
function Lumens() {
  return new Credit('Lumens', StellarSDK.Asset.native());
}

/**
*	Returns Evry coin (Native asset)
*	@return {Credit} Evry Coint
**/
function Evry() {
  return new Credit('Evry Coin', new StellarSDK.Asset(stellarEVRYAsset, stellarEVRYAssetIssuer));
}

/**
 * @typedef Credit
 * @property {string} name
 * @property {Object} asset
 */
class Credit {
  constructor(name, asset) {
    this.name = name;
    this.asset = asset;
  }
  
  getHexName() {
    if (!this.name) {
      throw ('cannot read name property');
    }
    return web3.utils.asciiToHex(this.name);
  }

  isNative() {
    return this.asset.getCode() === stellarEVRYAsset && this.asset.getIssuer() === stellarEVRYAssetIssuer
  }
}

export default {
  Lumens,
  Evry
};
