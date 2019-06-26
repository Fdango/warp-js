var {getStellarClient} = require('./src/stellar/stellar.js');
var {getTransferClient} = require('./src/transfer/transfer.js');
var config = require('./src/config/config.js');

/**
 * makes a move asset from stellar to evrynet request
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

module.exports = {config, ToEvrynet, transfer}
