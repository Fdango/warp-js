import {getStellarClient} from './src/stellar/stellar.js';
import {getTransferClient} from './src/transfer/transfer.js';
import config from './src/config/config.js';
import asset from './src/asset/asset.js';

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
    let tfClient = getTransferClient(cf);
    let stClient = getStellarClient(cf);
    let paymentXDR = await stClient.createPayment(src, amount, asset);
    return await tfClient.transfer(paymentXDR, evrynetAddress);
  } catch (e) {
    return e;
  }
}

export default {
  asset,
  config,
  ToEvrynet
}
