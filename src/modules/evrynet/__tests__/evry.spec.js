import { Evrynet } from '@/modules/evrynet/evrynet'
import EvrynetException from '@/exceptions/evrynet'
import Stream from 'stream'
import { WhitelistedAsset } from '@/entities/asset'
import map from 'lodash/map'
import { getEvryClient } from '../evrynet'
import { warpConfigInstance, WarpConfig, initWarpConfig } from '@/config'
import Ganache from 'ganache-cli'
import { Transaction } from 'ethereumjs-tx'

const warpConfig = new WarpConfig()
warpConfig.evrynet.provider = Ganache.provider()
warpConfig.evrynet.shouldUseEstimatedGas = true
initWarpConfig(warpConfig)

describe('EvryNet', () => {
  const senderpk = '0x789CA41C61F599ee883eB604c7D616F458dfC606'
  const senderpriv =
    'eec741cb4f13d6f4c873834bcce86b4059f32f54744a37042969fb37b5f2b4b0'
  const currentNonce = '1'
  const InputAsset = new WhitelistedAsset({
    code: 'bar',
    issuer: 'foo',
    decimal: 3,
    typeID: '1',
  })
  const expectedGRPCAsset = {
    code: 'bar',
    issuer: 'foo',
    decimal: 3,
    typeID: '1',
  }
  const unexpectedGRPCAsset = {
    code: 'bad',
    issuer: 'bad',
    decimal: 2,
    typeID: '2',
  }
  const expectedBalance = '1'
  const mockedGetBalCredit = new WhitelistedAsset({
    code: 'XLM',
    issuer: undefined,
    decimal: 3,
    typeID: '1',
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
    it('should get nonce correctly', async () => {
      let mockedStream = new Stream.Readable()
      mockedStream._read = () => { }
      const mockedClient = jest.fn().mockImplementation(() => {
        return {
          getNonce: jest.fn().mockReturnValue(mockedStream),
        }
      })
      const evrynet = new Evrynet(mockedClient(), warpConfigInstance.evrynet)
      setInterval(function () {
        mockedStream.emit('data', {
          getNonce: jest.fn().mockReturnValue(currentNonce),
        })
      }, 1000)
      let res = await evrynet.getNonce(senderpk)
      expect(res.nonce).toBe(currentNonce)
    })

    it('should throw an error', async () => {
      let mockedStream = new Stream.Readable()
      mockedStream._read = () => { }
      const mockedClient = jest.fn().mockImplementation(() => {
        return {
          getNonce: jest.fn().mockReturnValue(mockedStream),
        }
      })
      const evrynet = new Evrynet(mockedClient(), warpConfigInstance.evrynet)
      setInterval(function () {
        mockedStream.emit('error', new Error('this is an error'))
      }, 1000)
      await expect(evrynet.getNonce(senderpk)).rejects.toThrow(EvrynetException)
    })
  })

  describe('When get nonce from private key', () => {
    it('should get nonce correctly', async () => {
      let mockedStream = new Stream.Readable()
      mockedStream._read = () => { }
      const mockedClient = jest.fn().mockImplementation(() => {
        return {
          getNonce: jest.fn().mockReturnValue(mockedStream),
        }
      })
      const evrynet = new Evrynet(mockedClient(), warpConfigInstance.evrynet)
      setInterval(function () {
        mockedStream.emit('data', {
          getNonce: jest.fn().mockReturnValue(currentNonce),
        })
      }, 1000)
      let res = await evrynet.getNonceFromPriv(senderpriv)
      expect(res.nonce).toBe(currentNonce)
    })

    it('should throw an error', async () => {
      let mockedStream = new Stream.Readable()
      mockedStream._read = () => { }
      const mockedClient = jest.fn().mockImplementation(() => {
        return {
          getNonce: jest.fn().mockReturnValue(mockedStream),
        }
      })
      const evrynet = new Evrynet(mockedClient(), warpConfigInstance.evrynet)
      setInterval(function () {
        mockedStream.emit('error', new Error('this is an error'))
      }, 1000)
      await expect(evrynet.getNonceFromPriv(senderpriv)).rejects.toThrow(
        EvrynetException,
      )
    })
  })

  describe('When get whitelist assets', () => {
    describe('When a stream emit a data response', () => {
      it('should respond an expected array of assets', async () => {
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => { }
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
          }
        })
        const evrynet = new Evrynet(mockedClient(), warpConfigInstance.evrynet)
        setTimeout(function () {
          mockedStream.emit('data', {
            getNativeasset: jest.fn().mockReturnValue(undefined),
            getEvrynetcreditList: jest.fn().mockReturnValue([
              {
                getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                getIssuer: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.issuer),
                getDecimal: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.decimal),
                getTypeid: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.typeID),
              },
            ]),
            getStellarcreditList: jest.fn().mockReturnValue([
              {
                getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                getIssuer: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.issuer),
                getDecimal: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.decimal),
                getTypeid: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.typeID),
              },
            ]),
          })
        }, 100)
        const res = await evrynet.getWhitelistAssets({})
        const actual = map(res.assets, (ech) => ({
          code: ech.getCode(),
          issuer: ech.getIssuer(),
          decimal: ech.getDecimal(),
          typeID: ech.getTypeid(),
        }))
        expect(actual).toEqual(expect.arrayContaining([expectedGRPCAsset]))
      })

      describe('When a stream emit an error response', () => {
        it('should throw an error', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(mockedClient(), warpConfigInstance.evrynet)
          setTimeout(function () {
            mockedStream.emit('error', new Error('this is an error'))
          }, 100)
          await expect(evrynet.getWhitelistAssets({})).rejects.toThrow(
            EvrynetException,
          )
        })
      })
    })
  })

  describe('When check native asset', () => {
    it('should find to be a native asset', async () => {
      let mockedStream = new Stream.Readable()
      mockedStream._read = () => { }
      const mockedClient = jest.fn().mockImplementation(() => {
        return {
          getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
        }
      })
      const evrynet = new Evrynet(mockedClient(), warpConfigInstance.evrynet)
      setTimeout(function () {
        mockedStream.emit('data', {
          getNativeasset: jest.fn().mockReturnValue({
            getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
            getIssuer: jest.fn().mockReturnValue(expectedGRPCAsset.issuer),
            getDecimal: jest.fn().mockReturnValue(expectedGRPCAsset.decimal),
            getTypeid: jest.fn().mockReturnValue(expectedGRPCAsset.typeID),
          }),
          getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
          getStellarcreditList: jest.fn().mockReturnValue(undefined),
        })
      }, 100)
      await evrynet.getWhitelistAssets({})
      const ok = evrynet.isNativeAsset(InputAsset)
      expect(ok).toBeTruthy()
    })

    it('should not find to be a native asset', async () => {
      let mockedStream = new Stream.Readable()
      mockedStream._read = () => { }
      const mockedClient = jest.fn().mockImplementation(() => {
        return {
          getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
        }
      })
      const evrynet = new Evrynet(mockedClient(), warpConfigInstance.evrynet)
      setTimeout(function () {
        mockedStream.emit('data', {
          getNativeasset: jest.fn().mockReturnValue({
            getCode: jest.fn().mockReturnValue(unexpectedGRPCAsset.code),
            getIssuer: jest.fn().mockReturnValue(unexpectedGRPCAsset.issuer),
            getDecimal: jest.fn().mockReturnValue(unexpectedGRPCAsset.decimal),
            getTypeid: jest.fn().mockReturnValue(unexpectedGRPCAsset.typeID),
          }),
          getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
          getStellarcreditList: jest.fn().mockReturnValue(undefined),
        })
      }, 100)
      await evrynet.getWhitelistAssets({})
      const ok = evrynet.isNativeAsset(InputAsset)
      expect(ok).toBeFalsy()
    })
  })

  describe('When check evrynet asset', () => {
    it('should find to evrynet asset', async () => {
      let mockedStream = new Stream.Readable()
      mockedStream._read = () => { }
      const mockedClient = jest.fn().mockImplementation(() => {
        return {
          getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
        }
      })
      const evrynet = new Evrynet(mockedClient(), warpConfigInstance.evrynet)
      setTimeout(function () {
        mockedStream.emit('data', {
          getNativeasset: jest.fn().mockReturnValue(undefined),
          getEvrynetcreditList: jest.fn().mockReturnValue([
            {
              getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
              getIssuer: jest
                .fn()
                .mockReturnValue(expectedGRPCAsset.issuer),
              getDecimal: jest
                .fn()
                .mockReturnValue(expectedGRPCAsset.decimal),
              getTypeid: jest
                .fn()
                .mockReturnValue(expectedGRPCAsset.typeID),
            },
          ]),
          getStellarcreditList: jest.fn().mockReturnValue(undefined),
        })
      }, 100)
      await evrynet.getWhitelistAssets({})
      const ok = evrynet.isEvrynetAsset(InputAsset)
      expect(ok).toBeTruthy()
    })

    it('should not find to evrynet asset', async () => {
      let mockedStream = new Stream.Readable()
      mockedStream._read = () => { }
      const mockedClient = jest.fn().mockImplementation(() => {
        return {
          getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
        }
      })
      const evrynet = new Evrynet(mockedClient(), warpConfigInstance.evrynet)
      setTimeout(function () {
        mockedStream.emit('data', {
          getNativeasset: jest.fn().mockReturnValue(undefined),
          getEvrynetcreditList: jest.fn().mockReturnValue([
            {
              getCode: jest.fn().mockReturnValue(unexpectedGRPCAsset.code),
              getIssuer: jest.fn().mockReturnValue(unexpectedGRPCAsset.issuer),
              getDecimal: jest
                .fn()
                .mockReturnValue(unexpectedGRPCAsset.decimal),
              getTypeid: jest.fn().mockReturnValue(unexpectedGRPCAsset.typeID),
            },
          ]),
          getStellarcreditList: jest.fn().mockReturnValue(undefined),
        })
      }, 100)
      await evrynet.getWhitelistAssets({})
      const ok = evrynet.isEvrynetAsset(InputAsset)
      expect(ok).toBeFalsy()
    })
  })

  describe('When check stellar asset', () => {
    it('should find stellar asset', async () => {
      let mockedStream = new Stream.Readable()
      mockedStream._read = () => { }
      const mockedClient = jest.fn().mockImplementation(() => {
        return {
          getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
        }
      })
      const evrynet = new Evrynet(mockedClient(), warpConfigInstance.evrynet)
      setTimeout(function () {
        mockedStream.emit('data', {
          getStellarcreditList: jest.fn().mockReturnValue([
            {
              getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
              getIssuer: jest.fn().mockReturnValue(expectedGRPCAsset.issuer),
              getDecimal: jest
                .fn()
                .mockReturnValue(expectedGRPCAsset.decimal),
              getTypeid: jest.fn().mockReturnValue(expectedGRPCAsset.typeID),
            },
          ]),
          getNativeasset: jest.fn().mockReturnValue(undefined),
          getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
        })
      }, 100)
      await evrynet.getWhitelistAssets({})
      const ok = evrynet.isStellarAsset(InputAsset)
      expect(ok).toBeTruthy()
    })

    it('should not find stellar asset', async () => {
      let mockedStream = new Stream.Readable()
      mockedStream._read = () => { }
      const mockedClient = jest.fn().mockImplementation(() => {
        return {
          getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
        }
      })
      const evrynet = new Evrynet(mockedClient(), warpConfigInstance.evrynet)
      setTimeout(function () {
        mockedStream.emit('data', {
          getStellarcreditList: jest.fn().mockReturnValue([
            {
              getCode: jest.fn().mockReturnValue(unexpectedGRPCAsset.code),
              getIssuer: jest
                .fn()
                .mockReturnValue(unexpectedGRPCAsset.issuer),
              getDecimal: jest
                .fn()
                .mockReturnValue(unexpectedGRPCAsset.decimal),
              getTypeid: jest
                .fn()
                .mockReturnValue(unexpectedGRPCAsset.typeID),
            },
          ]),
          getNativeasset: jest.fn().mockReturnValue(undefined),
          getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
        })
      }, 100)
      await evrynet.getWhitelistAssets({})
      const ok = evrynet.isStellarAsset(InputAsset)
      expect(ok).toBeFalsy()
    })
  })

  describe('When get whitelist asset by code', () => {
    describe('When a stream emit a data response', () => {
      describe('With whitelist asset response', () => {
        it('should respond an expected asset', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setTimeout(function () {
            mockedStream.emit('data', {
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                getIssuer: jest.fn().mockReturnValue(expectedGRPCAsset.issuer),
                getDecimal: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.decimal),
                getTypeid: jest.fn().mockReturnValue(expectedGRPCAsset.typeID),
              }),
              getEvrynetcreditList: jest.fn().mockReturnValue([
                {
                  getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                  getIssuer: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.issuer),
                  getDecimal: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.decimal),
                  getTypeid: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.typeID),
                },
              ]),
              getStellarcreditList: jest.fn().mockReturnValue([
                {
                  getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                  getIssuer: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.issuer),
                  getDecimal: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.decimal),
                  getTypeid: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.typeID),
                },
              ]),
            })
          }, 100)
          const actual = await evrynet.getWhitelistAssetByCode(InputAsset)
          expect({
            code: actual.getCode(),
            issuer: actual.getIssuer(),
            decimal: actual.getDecimal(),
            typeID: actual.getTypeid(),
          }).toEqual(expectedGRPCAsset)
        })
      })
      describe('With whitelist undefined response (notfound)', () => {
        it('should respond an expected array of assets', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setTimeout(function () {
            mockedStream.emit('data', {
              getNativeasset: jest.fn().mockReturnValue(undefined),
              getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
            })
          }, 100)
          const actual = await evrynet.getWhitelistAssetByCode(InputAsset)
          expect(actual).toBeUndefined()
        })
      })
    })
    describe('When a stream emit an error response', () => {
      it('should throw an error', async () => {
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => { }
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
          }
        })
        const evrynet = new Evrynet(mockedClient(), warpConfigInstance.evrynet)
        setTimeout(function () {
          mockedStream.emit('error', new Error('this is an error'))
        }, 100)
        await expect(
          evrynet.getWhitelistAssetByCode({
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
        mockedStream._read = () => { }
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            getBalance: jest.fn().mockReturnValue(mockedStream),
          }
        })
        const evrynet = new Evrynet(mockedClient(), warpConfigInstance.evrynet)
        setTimeout(function () {
          mockedStream.emit('data', {
            getBalance: jest.fn().mockReturnValue(expectedBalance),
          })
        }, 100)
        await expect(
          evrynet.getBalance(getBalInput.accountAddress, getBalInput.asset),
        ).resolves.toEqual({
          balance: expectedBalance,
        })
      })
    })
    describe('When a stream emit an error response', () => {
      it('should throw an error', async () => {
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => { }
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            getBalance: jest.fn().mockReturnValue(mockedStream),
          }
        })
        const evrynet = new Evrynet(mockedClient(), warpConfigInstance.evrynet)
        setTimeout(function () {
          mockedStream.emit('error', new Error('this is an error'))
        }, 100)
        await expect(
          evrynet.getBalance(
            getBalInvalidInput.accountAddress,
            getBalInvalidInput.asset,
          ),
        ).rejects.toThrow(EvrynetException)
      })
    })
  })

  describe('When creating new lock raw tx', () => {
    describe('When success', () => {
      describe('When asset is a native', () => {
        it('should be success', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                getIssuer: jest.fn().mockReturnValue(expectedGRPCAsset.issuer),
                getDecimal: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.decimal),
                getTypeid: jest.fn().mockReturnValue(expectedGRPCAsset.typeID),
              }),
              getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
            })
          }, 1000)
          await evrynet.getWhitelistAssets({})
          const tx = await evrynet.newLockTx({
            asset: InputAsset,
            amount: '10',
            secret: senderpriv,
          })
          expect(tx.verifySignature()).toBeTruthy()
          const rwtxHex = evrynet.txToHex(tx)
          expect(rwtxHex).toBeDefined()
        })
      })

      describe('When asset is a evrynet asset', () => {
        it('should be success', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(undefined),
                getIssuer: jest.fn().mockReturnValue(undefined),
                getDecimal: jest.fn().mockReturnValue(undefined),
                getTypeid: jest.fn().mockReturnValue(undefined),
              }),
              getEvrynetcreditList: jest.fn().mockReturnValue([
                {
                  getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                  getIssuer: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.issuer),
                  getDecimal: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.decimal),
                  getTypeid: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.typeID),
                },
              ]),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
            })
          }, 1000)
          await evrynet.getWhitelistAssets({})
          const tx = await evrynet.newLockTx({
            asset: InputAsset,
            amount: '10',
            secret: senderpriv,
          })
          expect(tx.verifySignature()).toBeTruthy()
          const rwtxHex = evrynet.txToHex(tx)
          expect(rwtxHex).toBeDefined()
        })
      })

      describe('When asset is a stellar asset', () => {
        it('should be success', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(undefined),
                getIssuer: jest.fn().mockReturnValue(undefined),
                getDecimal: jest.fn().mockReturnValue(undefined),
                getTypeid: jest.fn().mockReturnValue(undefined),
              }),
              getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
              getStellarcreditList: jest.fn().mockReturnValue([
                {
                  getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                  getIssuer: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.issuer),
                  getDecimal: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.decimal),
                  getTypeid: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.typeID),
                },
              ]),
            })
          }, 100)
          await evrynet.getWhitelistAssets({})
          const tx = await evrynet.newLockTx({
            asset: InputAsset,
            amount: '10',
            secret: senderpriv,
          })
          expect(tx.verifySignature()).toBeTruthy()
          const rwtxHex = evrynet.txToHex(tx)
          expect(rwtxHex).toBeDefined()
        })
      })

      describe('When credit decimal is less than stellar atomic decimal unit', () => {
        it('should be successfully creating a new lock credit raw tx', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue(undefined),
              getEvrynetcreditList: jest.fn().mockReturnValue([
                {
                  getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                  getIssuer: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.issuer),
                  getDecimal: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.decimal),
                  getTypeid: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.typeID),
                },
              ]),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
            })
          }, 1000)
          await evrynet.getWhitelistAssets({})
          const tx = await evrynet.newLockTx({
            asset: InputAsset,
            amount: '10',
            secret: senderpriv,
          })
          expect(tx.verifySignature()).toBeTruthy()
          const rwtxHex = evrynet.txToHex(tx)
          expect(rwtxHex).toBeDefined()
        })
      })

      describe('When credit decimal is more than stellar atomic decimal unit', () => {
        it('should be successfully creating a new lock credit raw tx', async () => {
          const asset = InputAsset
          asset.decimal = 10
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue(undefined),
              getEvrynetcreditList: jest.fn().mockReturnValue([
                {
                  getCode: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.code),
                  getIssuer: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.issuer),
                  getDecimal: jest.fn().mockReturnValue(expectedGRPCAsset.decimal),
                  getTypeid: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.typeID),
                },
              ]),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
            })
          }, 1000)
          await evrynet.getWhitelistAssets({})
          const tx = await evrynet.newLockTx({
            asset,
            amount: '10',
            secret: senderpriv,
          })
          expect(tx.verifySignature()).toBeTruthy()
          const rwtxHex = evrynet.txToHex(tx)
          expect(rwtxHex).toBeDefined()
        })
      })
    })

    describe('When error', () => {
      describe('With invalid private key', () => {
        it('should throw an error from creating a new lock raw tx', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                getIssuer: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.issuer),
                getDecimal: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.decimal),
                getTypeid: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.typeID),
              }),
              getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
            })
          })
          await evrynet.getWhitelistAssets({})
          await expect(
            evrynet.newLockTx({
              asset: InputAsset,
              amount: '10',
              secret: 'badpriv',
            }),
          ).rejects.toThrow(EvrynetException)
        })
      })

      describe('With invalid asset', () => {
        it('should throw an error from creating a new lock raw tx', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(undefined),
                getIssuer: jest
                  .fn()
                  .mockReturnValue(undefined),
                getDecimal: jest
                  .fn()
                  .mockReturnValue(undefined),
                getTypeid: jest
                  .fn()
                  .mockReturnValue(undefined),
              }),
              getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
            })
          })
          await evrynet.getWhitelistAssets({})
          await expect(
            evrynet.newLockTx({
              asset: InputAsset,
              amount: 10,
              secret: senderpriv,
            }),
          ).rejects.toThrow(EvrynetException)
        })
      })

      describe('With invalid amount', () => {
        it('should throw an error from creating a new lock raw tx from zero', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                getIssuer: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.issuer),
                getDecimal: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.decimal),
                getTypeid: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.typeID),
              }),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
              getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
            })
          })
          await evrynet.getWhitelistAssets({})
          await expect(
            evrynet.newLockTx({
              asset: InputAsset,
              amount: '0',
              secret: senderpriv,
            }),
          ).rejects.toThrow(EvrynetException)
        })

        it('should throw an error from creating a new lock raw tx from negative', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                getIssuer: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.issuer),
                getDecimal: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.decimal),
                getTypeid: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.typeID),
              }),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
              getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
            })
          })
          await evrynet.getWhitelistAssets({})
          await expect(
            evrynet.newLockTx({
              asset: InputAsset,
              amount: '-1',
              secret: senderpriv,
            }),
          ).rejects.toThrow(EvrynetException)
        })

        it('should throw an error from creating a new lock raw tx from invalid decimal', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                getIssuer: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.issuer),
                getDecimal: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.decimal),
                getTypeid: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.typeID),
              }),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
              getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
            })
          })
          await evrynet.getWhitelistAssets({})
          await expect(
            evrynet.newLockTx({
              asset: InputAsset,
              amount: '1.00000001',
              secret: senderpriv,
            }),
          ).rejects.toThrow(EvrynetException)
        })
      })
    })
  })

  describe('When creating new unlock raw tx', () => {
    describe('When success', () => {
      describe('When asset is a native', () => {
        it('should be success', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                getIssuer: jest.fn().mockReturnValue(expectedGRPCAsset.issuer),
                getDecimal: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.decimal),
                getTypeid: jest.fn().mockReturnValue(expectedGRPCAsset.typeID),
              }),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
              getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
            })
          }, 1000)
          await evrynet.getWhitelistAssets({})
          const tx = await evrynet.newUnlockTx({
            asset: InputAsset,
            amount: '10',
            secret: senderpriv,
          })
          expect(tx.verifySignature()).toBeTruthy()
          const rwtxHex = evrynet.txToHex(tx)
          expect(rwtxHex).toBeDefined()
        })
      })

      describe('When asset is a evrynet asset', () => {
        it('should be success', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(undefined),
                getIssuer: jest.fn().mockReturnValue(undefined),
                getDecimal: jest.fn().mockReturnValue(undefined),
                getTypeid: jest.fn().mockReturnValue(undefined),
              }),
              getEvrynetcreditList: jest.fn().mockReturnValue([
                {
                  getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                  getIssuer: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.issuer),
                  getDecimal: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.decimal),
                  getTypeid: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.typeID),
                },
              ]),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
            })
          }, 1000)
          await evrynet.getWhitelistAssets({})
          const tx = await evrynet.newUnlockTx({
            asset: InputAsset,
            amount: '10',
            secret: senderpriv,
          })
          expect(tx.verifySignature()).toBeTruthy()
          const rwtxHex = evrynet.txToHex(tx)
          expect(rwtxHex).toBeDefined()
        })
      })

      describe('When asset is a stellar asset', () => {
        it('should be success', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(undefined),
                getIssuer: jest.fn().mockReturnValue(undefined),
                getDecimal: jest.fn().mockReturnValue(undefined),
                getTypeid: jest.fn().mockReturnValue(undefined),
              }),
              getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
              getStellarcreditList: jest.fn().mockReturnValue([
                {
                  getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                  getIssuer: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.issuer),
                  getDecimal: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.decimal),
                  getTypeid: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.typeID),
                },
              ]),
            })
          }, 100)
          await evrynet.getWhitelistAssets({})
          const tx = await evrynet.newUnlockTx({
            asset: InputAsset,
            amount: '10',
            secret: senderpriv,
          })
          expect(tx.verifySignature()).toBeTruthy()
          const rwtxHex = evrynet.txToHex(tx)
          expect(rwtxHex).toBeDefined()
        })
      })

      describe('When credit decimal is less than stellar atomic decimal unit', () => {
        it('should be successfully creating a new unlock raw tx', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(undefined),
                getIssuer: jest.fn().mockReturnValue(undefined),
                getDecimal: jest.fn().mockReturnValue(undefined),
                getTypeid: jest.fn().mockReturnValue(undefined),
              }),
              getEvrynetcreditList: jest.fn().mockReturnValue([
                {
                  getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                  getIssuer: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.issuer),
                  getDecimal: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.decimal),
                  getTypeid: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.typeID),
                },
              ]),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
            })
          }, 1000)
          await evrynet.getWhitelistAssets({})
          const tx = await evrynet.newUnlockTx({
            asset: InputAsset,
            amount: '10',
            secret: senderpriv,
          })
          expect(tx.verifySignature()).toBeTruthy()
          const rwtxHex = evrynet.txToHex(tx)
          expect(rwtxHex).toBeDefined()
        })
      })

      describe('When credit decimal is more than stellar atomic decimal unit', () => {
        it('should be successfully creating a new unlock raw tx', async () => {
          const asset = InputAsset
          asset.decimal = 10
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(undefined),
                getIssuer: jest.fn().mockReturnValue(undefined),
                getDecimal: jest.fn().mockReturnValue(undefined),
                getTypeid: jest.fn().mockReturnValue(undefined),
              }),
              getEvrynetcreditList: jest.fn().mockReturnValue([
                {
                  getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                  getIssuer: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.issuer),
                  getDecimal: jest.fn().mockReturnValue(10),
                  getTypeid: jest
                    .fn()
                    .mockReturnValue(expectedGRPCAsset.typeID),
                },
              ]),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
            })
          }, 1000)
          await evrynet.getWhitelistAssets({})
          const tx = await evrynet.newUnlockTx({
            asset,
            amount: '10',
            secret: senderpriv,
          })
          expect(tx.verifySignature()).toBeTruthy()
          const rwtxHex = evrynet.txToHex(tx)
          expect(rwtxHex).toBeDefined()
        })
      })
    })

    describe('When error', () => {
      describe('With invalid private key', () => {
        it('should throw an error from creating a unlock raw tx', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                getIssuer: jest.fn().mockReturnValue(expectedGRPCAsset.issuer),
                getDecimal: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.decimal),
                getTypeid: jest.fn().mockReturnValue(expectedGRPCAsset.typeID),
              }),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
              getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
            })
          })
          await evrynet.getWhitelistAssets({})
          await expect(
            evrynet.newUnlockTx({
              asset: InputAsset,
              amount: '10',
              secret: 'badpriv',
            }),
          ).rejects.toThrow(EvrynetException)
        })
      })

      describe('With invalid asset', () => {
        it('should throw an error from creating a new unlock raw tx', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(undefined),
                getIssuer: jest.fn().mockReturnValue(undefined),
                getDecimal: jest.fn().mockReturnValue(undefined),
                getTypeid: jest.fn().mockReturnValue(undefined),
              }),
              getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
            })
          })
          await evrynet.getWhitelistAssets({})
          await expect(
            evrynet.newUnlockTx({
              asset: InputAsset,
              amount: 10,
              secret: senderpriv,
            }),
          ).rejects.toThrow(EvrynetException)
        })
      })

      describe('With invalid amount', () => {
        it('should throw an error from creating a new unlock raw tx from zero', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                getIssuer: jest.fn().mockReturnValue(expectedGRPCAsset.issuer),
                getDecimal: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.decimal),
                getTypeid: jest.fn().mockReturnValue(expectedGRPCAsset.typeID),
              }),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
              getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
            })
          })
          await evrynet.getWhitelistAssets({})
          await expect(
            evrynet.newUnlockTx({
              asset: InputAsset,
              amount: '0',
              secret: senderpriv,
            }),
          ).rejects.toThrow(EvrynetException)
        })

        it('should throw an error from creating a new unlock raw tx from negative', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                getIssuer: jest.fn().mockReturnValue(expectedGRPCAsset.issuer),
                getDecimal: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.decimal),
                getTypeid: jest.fn().mockReturnValue(expectedGRPCAsset.typeID),
              }),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
              getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
            })
          })
          await evrynet.getWhitelistAssets({})
          await expect(
            evrynet.newUnlockTx({
              asset: InputAsset,
              amount: '-1',
              secret: senderpriv,
            }),
          ).rejects.toThrow(EvrynetException)
        })

        it('should throw an error from creating a new unlock raw tx from invalid decimal', async () => {
          let mockedStream = new Stream.Readable()
          mockedStream._read = () => { }
          const mockedClient = jest.fn().mockImplementation(() => {
            return {
              getNonce: jest.fn().mockReturnValue(mockedStream),
              getWhitelistAssets: jest.fn().mockReturnValue(mockedStream),
            }
          })
          const evrynet = new Evrynet(
            mockedClient(),
            warpConfigInstance.evrynet,
          )
          setInterval(function () {
            mockedStream.emit('data', {
              getNonce: jest.fn().mockReturnValue(currentNonce),
              getNativeasset: jest.fn().mockReturnValue({
                getCode: jest.fn().mockReturnValue(expectedGRPCAsset.code),
                getIssuer: jest.fn().mockReturnValue(expectedGRPCAsset.issuer),
                getDecimal: jest
                  .fn()
                  .mockReturnValue(expectedGRPCAsset.decimal),
                getTypeid: jest.fn().mockReturnValue(expectedGRPCAsset.typeID),
              }),
              getStellarcreditList: jest.fn().mockReturnValue(undefined),
              getEvrynetcreditList: jest.fn().mockReturnValue(undefined),
            })
          })
          await evrynet.getWhitelistAssets({})
          await expect(
            evrynet.newUnlockTx({
              asset: InputAsset,
              amount: '1.00000001',
              secret: senderpriv,
            }),
          ).rejects.toThrow(EvrynetException)
        })
      })
    })
  })

  describe('Convert tx to hex', () => {
    it('should convert success', () => {
      const evrynet = new Evrynet(null, warpConfigInstance.evrynet)
      const tx = new Transaction()
      const txHex = evrynet.txToHex(tx)
      expect(txHex).toBeDefined()
    })

    it('should throw an error', () => {
      const evrynet = new Evrynet(null, warpConfigInstance.evrynet)
      expect(function () {
        evrynet.txToHex('badTx')
      }).toThrow(EvrynetException)
    })
  })

  describe('Validate amount', () => {
    describe('When amount is valid', () => {
      describe('When decimal is less than stellar decimal unit', () => {
        it('Should return true on validation', () => {
          expect(
            getEvryClient(warpConfigInstance)._validateAmount('10.0000001', 10),
          ).toBe(true)
        })
      })
      describe('When decimal is less than stellar decimal unit', () => {
        it('Should return true on validation', () => {
          expect(
            getEvryClient(warpConfigInstance)._validateAmount('10.0000010', 6),
          ).toBe(true)
        })
      })
    })
    describe('When amount is invalid', () => {
      describe('When decimal is less than stellar decimal unit', () => {
        it('Should return true on validation', () => {
          expect(
            getEvryClient(warpConfigInstance)._validateAmount(
              '10.00000001',
              10,
            ),
          ).toBe(false)
        })
      })
      describe('When decimal is less than stellar decimal unit', () => {
        it('Should return true on validation', () => {
          expect(
            getEvryClient(warpConfigInstance)._validateAmount('10.0000011', 6),
          ).toBe(false)
        })
      })
    })
  })

  describe('when getting public key from private key', () => {
    it('should response a corerct public key', () => {
      const privateKey =
        '0a05a1645d8a0a5b8f593c84324ea36194211814ccc51211e81e6b09cf7a5460'
      const expected = `0x9993B01f1BBAF72f3B8f5fee269f15e483655e43`
      const evrynet = new Evrynet(null, warpConfigInstance.evrynet)
      expect(evrynet.getPublickeyFromPrivateKey(privateKey)).toEqual(expected)
    })
  })
})
