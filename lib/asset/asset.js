"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _stellarSdk = _interopRequireDefault(require("stellar-sdk"));

var _web = _interopRequireDefault(require("web3"));

const web3 = new _web.default();
const nativeCode = "EVRY";
const nativeIssuer = "GATIJFZRBQH6S2BM2M2LPK7NMZWS43VQJQJNMSAR7LHW3XVPBBNV7BE5";
/**
*	Returns XLM asset
*	@return {Credit} Lumens(XLM)
**/

function Lumens() {
  return new Credit('Lumens', _stellarSdk.default.Asset.native());
}
/**
*	Returns Evry coin (Native asset)
*	@return {Credit} Evry Coint
**/


function Evry() {
  return new Credit('Evry Coin', new _stellarSdk.default.Asset(nativeCode, nativeIssuer));
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
      throw 'cannot read name property';
    }

    return web3.utils.asciiToHex(this.name);
  }

  isNative() {
    return this.asset.getCode() == nativeCode && this.asset.getIssuer() == nativeIssuer;
  }

}

var _default = {
  Lumens,
  Evry
};
exports.default = _default;