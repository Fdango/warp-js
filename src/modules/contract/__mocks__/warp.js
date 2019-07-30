const mock = jest.genMockFromModule('@/modules/stellar/stellar')

mock.getWarpContract = jest.fn()

export const getWarpContract = mock.getWarpContract
export default {
  getWarpContract: mock.getWarpContract,
}
