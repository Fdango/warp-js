import path from 'path'
import { createMockServer } from 'grpc-mock'
import { getEvryClient } from '@/modules/evrynet/evrynet'
import EvrynetException from '@/exceptions/evrynet'

jest.mock('web3')

describe('EvryNet', () => {
  let client
  let mockServer
  const senderpk = '0x789CA41C61F599ee883eB604c7D616F458dfC606'
  const currentNonce = '1'
  const protoPath = `${path.resolve()}/proto/evrynet.proto`
  const host = 'localhost:50053'

  beforeAll(() => {
    client = getEvryClient({
      host,
    })
    mockServer = createMockServer({
      protoPath: protoPath,
      packageName: 'evrynet',
      serviceName: 'EvrynetGRPC',
      rules: [
        {
          method: 'GetNonce',
          streamType: 'server',
          stream: [{ output: { nonce: currentNonce } }],
          input: { evrynetAddress: senderpk },
        },
      ],
    })
    mockServer.listen(host)
  })

  afterAll(() => {
    mockServer.close(true)
  })

  describe('when get nonce', () => {
    it('should get a stellar sequenceNumber correctly', async () => {
      let res = await client.getNonce(senderpk)
      expect(res.nonce).toBe(currentNonce)
    })

    it('should fail getting a stellar sequenceNumber if input invalid', async () => {
      await expect(client.getNonce('Bad')).rejects.toThrow(EvrynetException)
    })
  })
})
