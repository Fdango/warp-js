import { getEvryAsset, getLumensAsset } from '@/entities/asset'
import { rootConfigInstance } from '@/config'

describe('Asset', () => {
  describe('When call each asset', () => {
    it('should returns a valid XLM asset', () => {
      let xlm = getLumensAsset()
      expect(xlm.getCode()).toBe('XLM')
      expect(xlm.getIssuer()).toBe('')
    })

    it('should returns a valid EVRY asset', () => {
      let evry = getEvryAsset()
      expect(evry.getCode()).toBe(rootConfigInstance.stellar.asset.evry.name)
      expect(evry.getIssuer()).toBe(rootConfigInstance.stellar.issuer)
    })
  })
})
