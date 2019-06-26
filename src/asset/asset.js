const StellarSDK = require('stellar-sdk');

module.exports = {
  XLM: () => {
    return StellarSDK.Asset.native();
  },
}
