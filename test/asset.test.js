import asset from '../src/asset/asset.js';

describe('Asset', () => {
  it('should returns a valid XLM asset', () => {
    let xlm = asset.Lumens();
    expect(xlm.asset.code).toBe('XLM');
    expect(xlm.asset.issuer).toBeUndefined();
  });
});
