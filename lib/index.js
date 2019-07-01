"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require('./src/stellar/stellar.js'),
    getStellarClient = _require.getStellarClient;

var _require2 = require('./src/transfer/transfer.js'),
    getTransferClient = _require2.getTransferClient;

var config = require('./src/config/config.js');

var asset = require('./src/asset/asset.js');
/**
 * makes a move asset from stellar to evrynet request
 * @param {string} src - a sender's stellar secret which contains the target asset
 * @param {string} amount - amount of an asset to be transfered
 * @param {StellarBase.Asset} asset - stellar asset to be transfered
 * @param {string} evrynetAddress - a recipient's Evrynet address
 */


function ToEvrynet(_x, _x2, _x3, _x4, _x5) {
  return _ToEvrynet.apply(this, arguments);
}

function _ToEvrynet() {
  _ToEvrynet = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(src, amount, asset, evrynetAddress, config) {
    var cf, tfClient, stClient, paymentXDR;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            cf = config || new config();
            tfClient = getTransferClient(cf);
            stClient = getStellarClient(cf);
            _context.next = 6;
            return stClient.createPayment(src, amount, asset);

          case 6:
            paymentXDR = _context.sent;
            _context.next = 9;
            return tfClient.transfer(paymentXDR, evrynetAddress);

          case 9:
            return _context.abrupt("return", _context.sent);

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", _context.t0);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 12]]);
  }));
  return _ToEvrynet.apply(this, arguments);
}

var _default = {
  asset: asset,
  config: config,
  ToEvrynet: ToEvrynet
};
exports["default"] = _default;