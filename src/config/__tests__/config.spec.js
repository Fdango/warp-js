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
        contract: {
          nativeCustodian: {
            address: 'foo',
          },
          evrynetCustodian: {
            address: 'foo',
          },
          stellarCustodian: {
            address: 'foo',
          },
        },
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
      expect(
        warpConfigInstance.evrynet.contract.nativeCustodian.address,
      ).not.toEqual(expected.evrynet.contract.nativeCustodian.address)
      expect(
        warpConfigInstance.evrynet.contract.evrynetCustodian.address,
      ).not.toEqual(expected.evrynet.contract.evrynetCustodian.address)
      expect(
        warpConfigInstance.evrynet.contract.stellarCustodian.address,
      ).not.toEqual(expected.evrynet.contract.stellarCustodian.address)
    })
  })

  describe('When initWarpConfig has been called', () => {
    test('root configuration instance should be changed', () => {
      let newConfig = new WarpConfig()
      newConfig.stellar.escrowAccount = expected.stellar.escrowAccount
      newConfig.grpc.proto.stellar = expected.grpc.stellar
      newConfig.evrynet.contract.nativeCustodian.address =
        expected.evrynet.contract.nativeCustodian.address
      newConfig.evrynet.contract.evrynetCustodian.address =
        expected.evrynet.contract.evrynetCustodian.address
      newConfig.evrynet.contract.stellarCustodian.address =
        expected.evrynet.contract.stellarCustodian.address
      initWarpConfig(newConfig)
      expect(warpConfigInstance.stellar.escrowAccount).toEqual(
        expected.stellar.escrowAccount,
      )
      expect(warpConfigInstance.grpc.proto.stellar).toEqual(
        expected.grpc.stellar,
      )
      expect(
        warpConfigInstance.evrynet.contract.nativeCustodian.address,
      ).toEqual(expected.evrynet.contract.nativeCustodian.address)
      expect(
        warpConfigInstance.evrynet.contract.evrynetCustodian.address,
      ).toEqual(expected.evrynet.contract.evrynetCustodian.address)
      expect(
        warpConfigInstance.evrynet.contract.stellarCustodian.address,
      ).toEqual(expected.evrynet.contract.stellarCustodian.address)
    })
  })
})
