import StellarSDK from 'stellar-sdk';

/**
*	Returns XLM asset
**/
function XLM() {
  return StellarSDK.Asset.native();
}

export default {
  XLM
};
