import { initWarpConfig, warpConfigInstance, WarpConfig } from '@/config'

describe('initWarpConfig', () => {
  let expected
  beforeAll(() => {
    expected = {
      stellar: {
        escrowAccount: 'foo',
      },
      grpc: {
        proto: {
          stellar: 'foo',
        },
      },
      evrynet: {
        contractAddress: 'foo',
      },
    }
  })
  describe("When initWarpConfig hasn't been called", () => {
    test('the value should be default', () => {
      expect(warpConfigInstance.stellar.escrowAccount).not.toEqual(
        expected.stellar.escrowAccount,
      )
      expect(warpConfigInstance.grpc.proto.stellar).not.toEqual(
        expected.grpc.stellar,
      )
      expect(warpConfigInstance.evrynet.contractAddress).not.toEqual(
        expected.evrynet.contractAddress,
      )
    })
  })

  describe('When initWarpConfig has been called', () => {
    test('root configuration instance should be changed', () => {
      let newConfig = new WarpConfig()
      newConfig.stellar.escrowAccount = expected.stellar.escrowAccount
      newConfig.grpc.proto.stellar = expected.grpc.stellar
      newConfig.evrynet.contractAddress = expected.evrynet.contractAddress
      initWarpConfig(newConfig)
      expect(warpConfigInstance.stellar.escrowAccount).toEqual(
        expected.stellar.escrowAccount,
      )
      expect(warpConfigInstance.grpc.proto.stellar).toEqual(
        expected.grpc.stellar,
      )
      expect(warpConfigInstance.evrynet.contractAddress).toEqual(
        expected.evrynet.contractAddress,
      )
    })
  })
})
