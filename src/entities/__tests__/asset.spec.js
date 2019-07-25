import {getEvryAsset, getLumensAsset} from '@/entities/asset';
import config from '@/config/config'
const {stellar: {EVRY_ASSET_NAME, EVRY_ASSET_ISSUER_PUB}} = config

describe('Asset', () => {
    describe('When call each asset', () => {
        it('should returns a valid XLM asset', () => {
            let xlm = getLumensAsset();
            expect(xlm.asset.code).toBe('XLM');
            expect(xlm.asset.issuer).toBeUndefined();
        });

        it('should returns a valid EVRY asset', () => {
            let evry = getEvryAsset();
            expect(evry.asset.code).toBe(EVRY_ASSET_NAME);
            expect(evry.asset.issuer).toBe(EVRY_ASSET_ISSUER_PUB);
        });
    })
});
