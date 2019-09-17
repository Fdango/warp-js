import { Evrynet } from '@/modules/evrynet/evrynet'
import EvrynetException from '@/exceptions/evrynet'
import Stream from 'stream'
import { WhitelistedAsset } from '@/entities/asset'
import map from 'lodash/map'

describe('EvryNet', () => {
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
  const expectedBalance = '1'
  const mockedGetBalCredit = new WhitelistedAsset({
    code: 'XLM',
    issuer: undefined,
    decimal: 3,
  })
  const getBalInput = {
    accountAddress: 'foo',
    asset: mockedGetBalCredit,
  }
  const getBalInvalidInput = {
    accountAddress: 'invalid',
    asset: mockedGetBalCredit,
  }

  describe('When get nonce', () => {
    it('should get a stellar sequenceNumber correctly', async () => {
      let mockedStream = new Stream.Readable()
      mockedStream._read = () => {}
      const mockedClient = jest.fn().mockImplementation(() => {
        return {
          getNonce: jest.fn().mockReturnValue(mockedStream),
        }
      })
      const evry = new Evrynet(mockedClient())
      setInterval(function() {
        mockedStream.emit('data', {
          getNonce: jest.fn().mockReturnValue(currentNonce),
        })
      }, 1000)
      let res = await evry.getNonce(senderpk)
      expect(res.nonce).toBe(currentNonce)
    })

    it('should fail getting a stellar sequenceNumber if input invalid', async () => {
      let mockedStream = new Stream.Readable()
      mockedStream._read = () => {}
      const mockedClient = jest.fn().mockImplementation(() => {
        return {
          getNonce: jest.fn().mockReturnValue(mockedStream),
        }
      })
      const evry = new Evrynet(mockedClient())
      setInterval(function() {
        mockedStream.emit('error', new Error('this is an error'))
      }, 1000)
      await expect(evry.getNonce(senderpk)).rejects.toThrow(EvrynetException)
    })
  })

  describe('When get whitelist assets', () => {
    describe('When a stream emit a data response', () => {
      it('should respond an expected array of assets', async () => {
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => {}
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
          }
        })
        const evry = new Evrynet(mockedClient())
        setInterval(function() {
          mockedStream.emit('data', {
            getAssetsList: jest.fn().mockReturnValue([
              {
                getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                getIssuer: jest.fn().mockReturnValue(expectedGRPCAsset.issuer),
                getDecimal: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.decimal),
              },
            ]),
          })
        }, 1000)
        const res = await evry.getWhitelistAssets({})
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
            getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
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
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => {}
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evry = new Evrynet(mockedClient())
          setInterval(function() {
            mockedStream.emit('data', {
              getAssetsList: jest.fn().mockReturnValue([
                {
                  getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                  getIssuer: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.issuer),
                  getDecimal: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.decimal),
                },
              ]),
            })
          }, 1000)
          const actual = await evry.getWhitelistAssetByCode(InputAsset)
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
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evry = new Evrynet(mockedClient())
          setInterval(function() {
            mockedStream.emit('data', {
              getAssetsList: jest.fn().mockReturnValue(undefined),
            })
          }, 1000)
          const actual = await evry.getWhitelistAssetByCode(InputAsset)
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
            getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
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
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => {}
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            getBalance: jest.fn().mockReturnValue(mockedStream),
          }
        })
        const evry = new Evrynet(mockedClient())
        setInterval(function() {
          mockedStream.emit('data', {
            getBalance: jest.fn().mockReturnValue(expectedBalance),
          })
        }, 1000)
        await expect(
          evry.getAccountBalance(getBalInput.accountAddress, getBalInput.asset),
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
            getBalance: jest.fn().mockReturnValue(mockedStream),
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

  describe('when getting public key from private key', () => {
    it('should response a corerct public key', () => {
      const privateKey =
        '0a05a1645d8a0a5b8f593c84324ea36194211814ccc51211e81e6b09cf7a5460'
      const expected = `0x9993B01f1BBAF72f3B8f5fee269f15e483655e43`
      const evrynet = new Evrynet()
      expect(evrynet.getPublickeyFromPrivateKey(privateKey)).toEqual(expected)
    })
  })
})
