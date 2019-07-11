import {getStellarClient} from './stellar/stellar.js';
import {getWarpContract, getEvryClient} from './evrynet/evrynet.js';
import {getTransferClient} from './transfer/transfer.js';
import config from './config/config.js';
import asset from './asset/asset.js';

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
    let stClient = getStellarClient(conf);
    let res = await stClient.getSequenceNumberBySecret(src);
    let paymentXDR = await stClient.createDepositTx(src, res.sequenceNumber, amount, asset);
    return await getTransferClient(conf).ToEvrynet(paymentXDR, evrynetAddress);
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
    let conf = config || new config();
    // instanciate stellar client
    let stClient = getStellarClient(conf);
    let res = await stClient.getSequenceNumberBySecret(stellarPriv);
    // make a stellar withdraw from escrow
    let stellarTx = await stClient.createWithdrawTx(stellarPriv, res.sequenceNumber, amount, asset);
    // instanciate evrynet client
    let evClient = getEvryClient(conf);
    let nonceRes = await evClient.getNonceFromPriv(evrynetPriv);
    // instanciate warp contract
    let wrp = getWarpContract();
    // make a lock asset msg call
    let tx;
    if (asset.isNative()) {
      tx = wrp.newNativeLockTx(amount, evrynetPriv, Number(nonceRes.nonce));
    } else {
      tx = wrp.newCreditLockTx(asset, amount, evrynetPriv, Number(nonceRes.nonce));
    }
    let evrynetTx = wrp.txToHex(tx);
    // make a transfer request
    return await getTransferClient(conf).ToStellar(evrynetTx, stellarTx);
  } catch (e) {
    return e;
  }
}

export default {
  asset,
  config,
  ToEvrynet,
  ToStellar
}
