const mock = jest.genMockFromModule('@/modules/stellar/stellar')

mock.getTransferClient = jest.fn()

export const getTransferClient = mock.getTransferClient
export default {
  getTransferClient: mock.getTransferClient,
}
