const mock = jest.genMockFromModule('@/modules/net/net')

mock.getNetClient = jest.fn()

export const getNetClient = mock.getNetClient
export default {
  getNetClient: mock.getNetClient,
}
