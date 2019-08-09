import path from 'path'
import { createMockServer } from 'grpc-mock'
import { getEvryClient, Evrynet } from '@/modules/evrynet/evrynet'
import EvrynetException from '@/exceptions/evrynet'
import Stream from 'stream'
import { WhitelistedAsset } from '@/entities/asset'
import map from 'lodash/map'

describe('EvryNet', () => {
  let client
  let mockServer
  const senderpk = '0x789CA41C61F599ee883eB604c7D616F458dfC606'
  const currentNonce = '1'
  const InputAsset = new WhitelistedAsset({
    code: 'bar',
    issuer: 'foo',
    decimal: 3,
  })
  const expectedGRPCAsset = {
    code: 'bar',
    issuer: 'foo',
    decimal: 3,
  }
  const protoPath = `${path.resolve()}/proto/evrynet.proto`
  const host = 'localhost:50053'
  const expectedBalance = '1'
  const mockedGetBalCredit = new WhitelistedAsset({
    code: 'XLM',
    issuer: undefined,
    decimal: 3,
  })
  const getBalGRPCInput = {
    accountAddress: 'foo',
    asset: {
      code: mockedGetBalCredit.getCode(),
      issuer: mockedGetBalCredit.getIssuer(),
      decimal: mockedGetBalCredit.getDecimal(),
    },
  }
  const getBalInput = {
    accountAddress: 'foo',
    asset: mockedGetBalCredit,
  }
  const getBalInvalidInput = {
    accountAddress: 'invalid',
    asset: mockedGetBalCredit,
  }

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
          stream: [{ output: { assets: [expectedGRPCAsset] } }],
          input: {},
        },
        {
          method: 'GetBalance',
          streamType: 'server',
          stream: [{ output: { balance: expectedBalance } }],
          input: getBalGRPCInput,
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
        const res = await client.getWhitelistAssets({})
        const actual = map(res.assets, (ech) => ({
          code: ech.getCode(),
          issuer: ech.getIssuer(),
          decimal: ech.getDecimal(),
        }))
        expect(actual).toEqual(expect.arrayContaining([expectedGRPCAsset]))
      })
    })
    describe('When a stream emit an error response', () => {
      it('should throw an error', async () => {
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => {}
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            GetWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
          }
        })
        const evry = new Evrynet(mockedClient())
        setInterval(function() {
          mockedStream.emit('error', new Error('this is an error'))
        }, 1000)
        await expect(evry.getWhitelistAssets({})).rejects.toThrow(
          EvrynetException,
        )
      })
    })
  })

  describe('When get whitelist asset by code', () => {
    describe('When a stream emit a data response', () => {
      describe('With whitelist asset response', () => {
        it('should respond an expected asset', async () => {
          const actual = await client.getWhitelistAssetByCode(InputAsset)
          expect({
            code: actual.getCode(),
            issuer: actual.getIssuer(),
            decimal: actual.getDecimal(),
          }).toEqual(expectedGRPCAsset)
        })
      })
      describe('With whitelist undefined response (notfound)', () => {
        it('should respond an expected array of assets', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => {}
          client.client.GetWhitelistAssets = jest
            .fn()
            .mockReturnValue(mockedStream)
          setInterval(function() {
            mockedStream.emit('data', { asset: undefined })
          }, 1000)
          const actual = await client.getWhitelistAssetByCode(InputAsset)
          expect(actual).toBeUndefined()
        })
      })
    })
    describe('When a stream emit an error response', () => {
      it('should throw an error', async () => {
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => {}
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            GetWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
          }
        })
        const evry = new Evrynet(mockedClient())
        setInterval(function() {
          mockedStream.emit('error', new Error('this is an error'))
        }, 1000)
        await expect(
          evry.getWhitelistAssetByCode({
            code: null,
            issuer: 'invalid',
          }),
        ).rejects.toThrow(EvrynetException)
      })
    })
  })

  describe('When get account balance', () => {
    describe('When valid input', () => {
      it('should respond an expected balance', async () => {
        await expect(
          client.getAccountBalance(
            getBalInput.accountAddress,
            getBalInput.asset,
          ),
        ).resolves.toEqual({
          balance: expectedBalance,
        })
      })
    })
    describe('When a stream emit an error response', () => {
      it('should throw an error', async () => {
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => {}
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            GetBalance: jest.fn().mockReturnValue(mockedStream),
          }
        })
        const evry = new Evrynet(mockedClient())
        setInterval(function() {
          mockedStream.emit('error', new Error('this is an error'))
        }, 1000)
        await expect(
          evry.getAccountBalance(
            getBalInvalidInput.accountAddress,
            getBalInvalidInput.asset,
          ),
        ).rejects.toThrow(EvrynetException)
      })
    })
  })
})
