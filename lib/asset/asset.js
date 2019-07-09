"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _stellarSdk = _interopRequireDefault(require("stellar-sdk"));

/**
*	Returns XLM asset
**/
function XLM() {
  return _stellarSdk.default.Asset.native();
}

var _default = {
  XLM
};
exports.default = _default;