"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _stellar = require("./stellar/stellar.js");

var _evrynet = require("./evrynet/evrynet.js");

var _transfer = require("./transfer/transfer.js");

var _config = _interopRequireDefault(require("./config/config.js"));

var _asset = _interopRequireDefault(require("./asset/asset.js"));

/**
 * Makes a move asset from stellar to evrynet request
 * @param {string} src - a sender's stellar secret which holds the target asset
 * @param {string} amount - amount of an asset to be transfered
 * @param {Object} asset - stellar asset to be transfered
 * @param {string} evrynetAddress - a recipient's Evrynet address
 * @param {config} [config]
 */
async function ToEvrynet(src, amount, asset, evrynetAddress, config) {
  try {
    // load the grpc config
    let conf = config || new config();
    let stClient = (0, _stellar.getStellarClient)(conf);
    let res = await stClient.getSequenceNumberBySecret(src);
    let paymentXDR = await stClient.createDepositTx(src, res.sequenceNumber, amount, asset);
    return await (0, _transfer.getTransferClient)(conf).ToEvrynet(paymentXDR, evrynetAddress);
  } catch (e) {
    return e;
  }
}
/**
 * Makes a move asset from evrynet to stellar request
 * @param {string} evrynetPriv - a sender's evrynet secret which holds the target asset
 * @param {string} stellarPriv - a sender's stellar secret which will recive the asset
 * @param {string} amount - amount of an asset to be transfered
 * @param {Object} asset - stellar asset to be transfered
 * @param {config} [config]
 */


async function ToStellar(evrynetPriv, stellarPriv, amount, asset, config) {
  try {
    // load the grpc config
    let conf = config || new config(); // instanciate stellar client

    let stClient = (0, _stellar.getStellarClient)(conf);
    let res = await stClient.getSequenceNumberBySecret(stellarPriv); // make a stellar withdraw from escrow

    let stellarTx = await stClient.createWithdrawTx(stellarPriv, res.sequenceNumber, amount, asset); // instanciate evrynet client

    let evClient = (0, _evrynet.getEvryClient)(conf);
    let nonceRes = await evClient.getNonceFromPriv(evrynetPriv); // instanciate warp contract

    let wrp = (0, _evrynet.getWarpContract)(); // make a lock asset msg call

    let tx;

    if (asset.isNative()) {
      tx = wrp.newNativeLockTx(amount, evrynetPriv, Number(nonceRes.nonce));
    } else {
      tx = wrp.newCreditLockTx(asset, amount, evrynetPriv, Number(nonceRes.nonce));
    }

    let evrynetTx = wrp.txToHex(tx); // make a transfer request

    return await (0, _transfer.getTransferClient)(conf).ToStellar(evrynetTx, stellarTx);
  } catch (e) {
    return e;
  }
}

var _default = {
  asset: _asset.default,
  config: _config.default,
  ToEvrynet,
  ToStellar
};
exports.default = _default;