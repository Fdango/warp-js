import StellarSDK from 'stellar-sdk';
import Web3 from 'web3';
import {stellar} from '@/config/config';
const web3 = new Web3();
const {EVRY_ASSET_NAME, EVRY_ASSET_ISSUER_PUB} = stellar

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
  return new Credit('Evry Coin', new StellarSDK.Asset(EVRY_ASSET_NAME, EVRY_ASSET_ISSUER_PUB));
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
    return this.asset.getCode() === EVRY_ASSET_NAME && this.asset.getIssuer() === EVRY_ASSET_ISSUER_PUB
  }
}

export default {
  Lumens,
  Evry
};
