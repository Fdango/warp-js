import StellarSDK from 'stellar-sdk';
import Web3 from 'web3';

const web3 = new Web3();

const nativeCode = "EVRY"
const nativeIssuer = "GATIJFZRBQH6S2BM2M2LPK7NMZWS43VQJQJNMSAR7LHW3XVPBBNV7BE5"

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
  return new Credit('Evry Coin', new StellarSDK.Asset(nativeCode, nativeIssuer));
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
    return this.asset.getCode() == nativeCode && this.asset.getIssuer() == nativeIssuer
  }
}

export default {
  Lumens,
  Evry
};
