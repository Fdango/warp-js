const assert = require('assert');
const asset = require('../src/asset/asset.js');

describe('Asset', function () {
  it('should returns XLM asset', function () {
    let xlm = asset.XLM();
    assert(xlm.code === 'XLM');
    assert(xlm.issuer === undefined);
  });
});
