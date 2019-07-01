import assert from 'assert';
import asset from '../src/asset/asset.js';

describe('Asset', () => {
  it('should returns XLM asset', () => {
    let xlm = asset.XLM();
    assert(xlm.code === 'XLM');
    assert(xlm.issuer === undefined);
  });
});
