const mock = jest.genMockFromModule('@/modules/evrynet/evrynet')

mock.getEvryClient = jest.fn()

export const getEvryClient = mock.getEvryClient
export default {
  getEvryClient: mock.getEvryClient,
}
