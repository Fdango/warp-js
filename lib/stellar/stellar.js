"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStellarClient = getStellarClient;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _grpc = _interopRequireDefault(require("grpc"));

var _protoLoader = require("@grpc/proto-loader");

var _stellarSdk = _interopRequireDefault(require("stellar-sdk"));

var _path = _interopRequireDefault(require("path"));

var PROTO_PATH = _path["default"].resolve() + '/proto/stellar.proto';
var packageDefinition = (0, _protoLoader.loadSync)(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

var packageDescriptor = _grpc["default"].loadPackageDefinition(packageDefinition);

var stellar_proto = packageDescriptor.stellar;
var sc;
/**
 * Returns a Stellar client
 * @param {ClientConfig} config - grpc client configuration
 * @return {Stellar}
 */

function getStellarClient(config) {
  if (!sc) {
    sc = new Stellar(config);
  }

  return sc;
}
/**
 *  @typedef {Object} Stellar
 *  @property {Object} client - grpc client for stellar integration
 */


var Stellar =
/*#__PURE__*/
function () {
  /**
   * @constructor
   * @param {ClientConfig} config
   */
  function Stellar(config) {
    (0, _classCallCheck2["default"])(this, Stellar);

    _stellarSdk["default"].Network.useTestNetwork();

    this.client = new stellar_proto.StellarGRPC(config.getHost(), config.getSecure());
  }
  /**
   * Returns a next sequence number for a given address
   * @param {string} address - stellar address to get a sequence number
   **/


  (0, _createClass2["default"])(Stellar, [{
    key: "getSequenceNumber",
    value: function getSequenceNumber(address) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var chan = _this.client.GetSequenceNumber({
          stellarAddress: address
        });

        chan.on('data', function (data) {
          resolve(data);
        });
        chan.on('error', function (err) {
          reject(err);
        });
      });
    }
    /**
     * Creates a payment operation XDR for given params
     * @param {string} src - a sender's stellar secret which contains the target asset
     * @param {string} amount - amount of an asset to be transfered
     * @param {StellarSDK.Asset} asset - stellar asset to be transfered
     **/

  }, {
    key: "createPayment",
    value: function () {
      var _createPayment = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(src, amount, asset) {
        var kp, pk, res, account, transaction;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                kp = _stellarSdk["default"].Keypair.fromSecret(src);
                pk = kp.publicKey();
                _context.prev = 2;
                _context.next = 5;
                return this.getSequenceNumber(pk);

              case 5:
                res = _context.sent;
                account = new _stellarSdk["default"].Account(pk, res.sequenceNumber);
                transaction = new _stellarSdk["default"].TransactionBuilder(account, {
                  fee: _stellarSdk["default"].BASE_FEE
                }) // add a payment operation to the transaction
                .addOperation(_stellarSdk["default"].Operation.payment({
                  destination: "GAAQ4EOKRV3O5MC42JPREIUYRCTXUE6JLXWHMETM24AFACXWE54FQATQ",
                  asset: asset,
                  amount: amount
                })) // mark this transaction as valid only forever
                .setTimeout(_stellarSdk["default"].TimeoutInfinite).build(); // sign the transaction

                transaction.sign(kp);
                return _context.abrupt("return", transaction.toXDR());

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](2);
                return _context.abrupt("return", _context.t0);

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 12]]);
      }));

      function createPayment(_x, _x2, _x3) {
        return _createPayment.apply(this, arguments);
      }

      return createPayment;
    }()
  }]);
  return Stellar;
}();