import StellarSDK from 'stellar-sdk';
import Web3 from 'web3';
import {throws} from 'assert';

const web3 = new Web3();

/**
*	Returns XLM asset
*	@return {Credit} Lumens(XLM)
**/
function Lumens() {
  return new Credit('Lumens', StellarSDK.Asset.native())
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
}

/**
 * @typedef Native
 * @property {string} name
 * @property {Object} asset
 */
//class Native {
//constructor(name, asset) {
//this.name = name;
//this.asset = asset;
//}
//}

export default {
  Lumens
};
