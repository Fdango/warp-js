"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _stellar = require("./stellar/stellar.js");

var _transfer = require("./transfer/transfer.js");

var _config = _interopRequireDefault(require("./config/config.js"));

var _asset = _interopRequireDefault(require("./asset/asset.js"));

/**
 * Makes a move asset from stellar to evrynet request
 * @param {string} src - a sender's stellar secret which contains the target asset
 * @param {string} amount - amount of an asset to be transfered
 * @param {StellarBase.Asset} asset - stellar asset to be transfered
 * @param {string} evrynetAddress - a recipient's Evrynet address
 */
async function ToEvrynet(src, amount, asset, evrynetAddress, config) {
  try {
    let cf = config || new config();
    let tfClient = (0, _transfer.getTransferClient)(cf);
    let stClient = (0, _stellar.getStellarClient)(cf);
    let paymentXDR = await stClient.createPayment(src, amount, asset);
    return await tfClient.transfer(paymentXDR, evrynetAddress);
  } catch (e) {
    return e;
  }
}

var _default = {
  asset: _asset.default,
  config: _config.default,
  ToEvrynet
};
exports.default = _default;