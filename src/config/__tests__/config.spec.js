import { initWarpConfig, warpConfigInstance, WarpConfig } from '@/config'

describe('initWarpConfig', () => {
  test('root configuration instance should be changed', () => {
    const expected = 'foo'
    let newConfig = new WarpConfig()
    newConfig.stellar.escrowAccount = expected
    initWarpConfig(newConfig)
    expect(warpConfigInstance.stellar.escrowAccount).toEqual(expected)
  })
})
