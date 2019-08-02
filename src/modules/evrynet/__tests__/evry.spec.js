import path from 'path'
import { createMockServer } from 'grpc-mock'
import { getEvryClient } from '@/modules/evrynet/evrynet'
import EvrynetException from '@/exceptions/evrynet'
import Stream from 'stream'

describe('EvryNet', () => {
  let client
  let mockServer
  const senderpk = '0x789CA41C61F599ee883eB604c7D616F458dfC606'
  const currentNonce = '1'
  const expectedAsset = {
    name: 'foo',
    code: 'bar',
    issuer: 'foo',
  }
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
        {
          method: 'GetWhitelistAssets',
          streamType: 'server',
          stream: [{ output: { assets: [expectedAsset] } }],
          input: {},
        },
      ],
    })
    mockServer.listen(host)
  })

  afterAll(() => {
    mockServer.close(true)
  })

  describe('When get nonce', () => {
    it('should get a stellar sequenceNumber correctly', async () => {
      let res = await client.getNonce(senderpk)
      expect(res.nonce).toBe(currentNonce)
    })

    it('should fail getting a stellar sequenceNumber if input invalid', async () => {
      await expect(client.getNonce('Bad')).rejects.toThrow(EvrynetException)
    })
  })

  describe('When get whitelist assets', () => {
    describe('When a stream emit a data response', () => {
      it('should respond an expected array of assets', async () => {
        let res = await client.getWhitelistAssets({})
        expect(res.assets).toEqual(expect.arrayContaining([expectedAsset]))
      })
    })
    describe('When a stream emit an error response', () => {
      it('should throw an error', async () => {
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => {}
        client.client.GetWhitelistAssets = jest
          .fn()
          .mockReturnValue(mockedStream)
        setInterval(function() {
          mockedStream.emit('error', new Error('this is an error'))
        }, 1000)
        await expect(client.getWhitelistAssets({})).rejects.toThrow(
          EvrynetException,
        )
      })
    })
  })
})
