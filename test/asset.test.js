import asset from '../src/asset/asset.js';

describe('Asset', () => {
  it('should returns a valid XLM asset', () => {
    let xlm = asset.XLM();
    expect(xlm.code).toBe('XLM');
    expect(xlm.issuer).toBeUndefined();
  });
});
