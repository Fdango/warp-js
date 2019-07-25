import asset from '../src/asset/asset.js';

describe('Asset', () => {
  it('should returns a valid XLM asset', () => {
    let xlm = asset.Lumens();
    expect(xlm.asset.code).toBe('XLM');
    expect(xlm.asset.issuer).toBeUndefined();
  });
  it('should returns a valid EVRY asset', () => {
    let evry = asset.Evry();
    expect(evry.asset.code).toBe('EVRY');
    expect(evry.asset.issuer).toBe("GATIJFZRBQH6S2BM2M2LPK7NMZWS43VQJQJNMSAR7LHW3XVPBBNV7BE5");
  });
});
