const mock = jest.genMockFromModule('@/modules/stellar/stellar')

mock.getStellarClient = jest.fn()

export const getStellarClient = mock.getStellarClient
export default {
  getStellarClient,
}
