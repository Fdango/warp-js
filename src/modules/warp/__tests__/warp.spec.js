import Warp from '@/modules/warp'
import { getStellarClient } from '@/modules/stellar/stellar'
import { getTransferClient } from '@/modules/transfer/transfer'
import { getWarpContract } from '@/modules/contract/warp'
import { getEvryClient } from '@/modules/evrynet/evrynet'
import WarpException from '@/exceptions/warp_sdk'

jest.mock('@/modules/transfer/transfer')
jest.mock('@/modules/stellar/stellar')
jest.mock('@/modules/contract/warp')
jest.mock('@/modules/evrynet/evrynet')

describe('Warp SDK', () => {
  let warp
  beforeEach(() => {
    getStellarClient.mockReset()
    getTransferClient.mockReset()
    getWarpContract.mockReset()
    getEvryClient.mockReset()
  })
  describe('When calling toEvrynet', () => {
    let input = {
      src: 'foo',
      amount: '100',
      asset: {},
      evrynetAddress: 'bar',
    }
    describe('When all functions are successfully called', () => {
      const expected = {
        stellarTxHash: 'foo',
        evrynetTxHash: 'bar',
      }
      it('should return data object', async () => {
        input.asset = {
          isNative: jest.fn().mockReturnValue(true),
          code: 'foo',
          issuer: 'bar',
          toStellarFormat: jest.fn().mockReturnValue(input.asset),
        }
        getStellarClient.mockImplementation(() => {
          return {
            async createDepositTx() {
              return 'foo'
            },
            getSequenceNumberBySecret: jest.fn().mockResolvedValue({
              sequenceNumber: 1,
            }),
          }
        })
        getEvryClient.mockImplementation(() => {
          return {
            getWhitelistAssetByCode: jest.fn().mockResolvedValue({
              ...input.asset,
              decimal: 1,
            }),
          }
        })
        getTransferClient.mockImplementation(() => {
          return {
            toEvrynet: jest.fn().mockResolvedValue(expected),
          }
        })
        warp = new Warp()
        const res = await warp.toEvrynet(input)
        const getSequenceNumberBySecretArg =
          getStellarClient.mock.results[0].value.getSequenceNumberBySecret.mock
            .calls[0][0]
        expect(getSequenceNumberBySecretArg).toBe(input.src)
        expect(res).toBeTruthy()
        expect(res).toEqual(expected)
      })
    })

    describe('When errors occur', () => {
      describe('With rejected getSequenceNumberBySecret', () => {
        it('should throw an error', async () => {
          getStellarClient.mockImplementation(() => {
            return {
              getSequenceNumberBySecret: jest
                .fn()
                .mockRejectedValue(new Error('this is a error')),
            }
          })
          warp = new Warp()
          await expect(warp.toEvrynet(input)).rejects.toThrow(WarpException)
        })
      })

      describe('With error from createDepositTx', () => {
        it('should throw an error', async () => {
          getStellarClient.mockImplementation(() => {
            return {
              createDepositTx: jest.fn().mockImplementation(async () => {
                throw new Error('this is error')
              }),
              getSequenceNumberBySecret: jest.fn().mockResolvedValue({
                sequenceNumber: 1,
              }),
            }
          })
          warp = new Warp()
          await expect(warp.toEvrynet(input)).rejects.toThrowError(
            WarpException,
          )
        })
      })

      describe('With rejected to evrynet', () => {
        it('should throw an error', async () => {
          getStellarClient.mockImplementation(() => {
            return {
              async createDepositTx() {
                return 'foo'
              },
              getSequenceNumberBySecret: jest.fn().mockResolvedValue({
                sequenceNumber: 1,
              }),
            }
          })
          getTransferClient.mockImplementation(() => {
            return {
              toEvrynet: jest
                .fn()
                .mockRejectedValue(new Error('this is a error')),
            }
          })
          warp = new Warp()
          await expect(warp.toEvrynet(input)).rejects.toThrow(WarpException)
        })
      })
    })
  })

  describe('When calling toStellar', () => {
    let input = {
      evrynetPriv: 'foo',
      stellarPriv: 'bar',
      amount: '100',
      evrynetAddress: 'bar',
      asset: {},
    }
    describe('When all functions are successfully called', () => {
      const expected = {
        stellarTxHash: 'foo',
        evrynetTxHash: 'bar',
      }
      describe('When asset is native', () => {
        it('should return data object', async () => {
          input.asset = {
            isNative: jest.fn().mockReturnValue(true),
            code: 'foo',
            issuer: 'bar',
            toStellarFormat: jest.fn().mockReturnValue(input.asset),
          }
          getStellarClient.mockImplementation(() => {
            return {
              async createWithdrawTx() {
                return 'foo'
              },
              getSequenceNumberBySecret: jest.fn().mockResolvedValue({
                sequenceNumber: 1,
              }),
            }
          })
          getTransferClient.mockImplementation(() => {
            return {
              toStellar: jest.fn().mockResolvedValue(expected),
            }
          })
          getWarpContract.mockImplementation(() => {
            return {
              newNativeLockTx: jest.fn().mockReturnValue('bar'),
              txToHex: jest.fn().mockReturnValue('foo'),
            }
          })
          getEvryClient.mockImplementation(() => {
            return {
              getNonceFromPriv: jest.fn().mockResolvedValue({
                nonce: 'foo',
              }),
              getWhitelistAssetByCode: jest.fn().mockResolvedValue({
                ...input.asset,
                decimal: 1,
              }),
            }
          })
          warp = new Warp()
          const res = await warp.toStellar(input)
          const getSequenceNumberBySecretArg =
            getStellarClient.mock.results[0].value.getSequenceNumberBySecret
              .mock.calls[0][0]
          expect(getSequenceNumberBySecretArg).toBe(input.stellarPriv)
          expect(res).toBeTruthy()
          expect(res).toEqual(expected)
        })
      })
      describe('When asset is credit', () => {
        it('should return data object', async () => {
          input.asset = {
            isNative: jest.fn().mockReturnValue(false),
            code: 'foo',
            issuer: 'bar',
            toStellarFormat: jest.fn().mockReturnValue(input.asset),
          }
          getStellarClient.mockImplementation(() => {
            return {
              async createWithdrawTx() {
                return 'foo'
              },
              getSequenceNumberBySecret: jest.fn().mockResolvedValue({
                sequenceNumber: 1,
              }),
            }
          })
          getTransferClient.mockImplementation(() => {
            return {
              toStellar: jest.fn().mockResolvedValue(expected),
            }
          })
          getWarpContract.mockImplementation(() => {
            return {
              newCreditLockTx: jest.fn().mockReturnValue('bar'),
              txToHex: jest.fn().mockReturnValue('foo'),
            }
          })
          getEvryClient.mockImplementation(() => {
            return {
              getNonceFromPriv: jest.fn().mockResolvedValue({
                nonce: 'foo',
              }),
              getWhitelistAssetByCode: jest.fn().mockResolvedValue({
                ...input.asset,
                decimal: 1,
              }),
            }
          })
          warp = new Warp()
          const res = await warp.toStellar(input)
          const getSequenceNumberBySecretArg =
            getStellarClient.mock.results[0].value.getSequenceNumberBySecret
              .mock.calls[0][0]
          expect(getSequenceNumberBySecretArg).toBe(input.stellarPriv)
          expect(res).toBeTruthy()
          expect(res).toEqual(expected)
        })
      })
    })

    describe('When some errors occur', () => {
      describe('With rejected getSequenceNumberBySecret', () => {
        it('should throw an error', async () => {
          getStellarClient.mockImplementation(() => {
            return {
              getSequenceNumberBySecret: jest
                .fn()
                .mockRejectedValue(new Error('this is a error')),
            }
          })
          warp = new Warp()
          await expect(warp.toStellar(input)).rejects.toThrow(WarpException)
        })
      })

      describe('With error from createWithdrawTx', () => {
        it('should throw an error', async () => {
          getStellarClient.mockImplementation(() => {
            return {
              createWithdrawTx: jest
                .fn()
                .mockRejectedValue(new Error('this is an error')),
              getSequenceNumberBySecret: jest.fn().mockResolvedValue({
                sequenceNumber: 1,
              }),
            }
          })
          warp = new Warp()
          await expect(warp.toStellar(input)).rejects.toThrowError(
            WarpException,
          )
        })
      })

      describe('With error from getting nonce from evry', () => {
        it('should throw an error', async () => {
          getStellarClient.mockImplementation(() => {
            return {
              async createWithdrawTx() {
                return 'foo'
              },
              getSequenceNumberBySecret: jest.fn().mockResolvedValue({
                sequenceNumber: 1,
              }),
            }
          })
          getWarpContract.mockImplementation(() => {
            return {
              newCreditLockTx: jest.fn().mockReturnValue('bar'),
            }
          })
          getEvryClient.mockImplementation(() => {
            return {
              getNonceFromPriv: jest
                .fn()
                .mockRejectedValue(new Error('this is an error')),
            }
          })
          warp = new Warp()
          await expect(warp.toStellar(input)).rejects.toThrowError(
            WarpException,
          )
        })
      })

      describe('When asset is native ', () => {
        describe('With error from newNativeLockTx', () => {
          it('should throw an error', async () => {
            getStellarClient.mockImplementation(() => {
              return {
                async createWithdrawTx() {
                  return 'foo'
                },
                getSequenceNumberBySecret: jest.fn().mockResolvedValue({
                  sequenceNumber: 1,
                }),
              }
            })
            getWarpContract.mockImplementation(() => {
              return {
                newNativeLockTx: jest
                  .fn()
                  .mockRejectedValue(new Error('this is an error')),
              }
            })
            getEvryClient.mockImplementation(() => {
              return {
                getNonceFromPriv: jest.fn().mockResolvedValue({
                  nonce: 'foo',
                }),
              }
            })
            input.asset = {
              isNative: jest.fn().mockReturnValue(true),
            }
            warp = new Warp()
            await expect(warp.toStellar(input)).rejects.toThrowError(
              WarpException,
            )
          })
        })

        describe('With error from txToHex', () => {
          it('should throw an error', async () => {
            getStellarClient.mockImplementation(() => {
              return {
                async createWithdrawTx() {
                  return 'foo'
                },
                getSequenceNumberBySecret: jest.fn().mockResolvedValue({
                  sequenceNumber: 1,
                }),
              }
            })
            getWarpContract.mockImplementation(() => {
              return {
                newNativeLockTx: jest.fn().mockReturnValue('bar'),
                txToHex: jest
                  .fn()
                  .mockRejectedValue(new Error('this is an error')),
              }
            })
            getEvryClient.mockImplementation(() => {
              return {
                getNonceFromPriv: jest.fn().mockResolvedValue({
                  nonce: 'foo',
                }),
              }
            })
            input.asset = {
              isNative: jest.fn().mockReturnValue(true),
            }
            warp = new Warp()
            await expect(warp.toStellar(input)).rejects.toThrowError(
              WarpException,
            )
          })
        })
      })

      describe('When asset is credit', () => {
        describe('With error from newNativeLockTx', () => {
          it('should throw an error', async () => {
            getStellarClient.mockImplementation(() => {
              return {
                async createWithdrawTx() {
                  return 'foo'
                },
                getSequenceNumberBySecret: jest.fn().mockResolvedValue({
                  sequenceNumber: 1,
                }),
              }
            })
            getWarpContract.mockImplementation(() => {
              return {
                newCreditLockTx: jest
                  .fn()
                  .mockRejectedValue(new Error('this is an error')),
              }
            })
            getEvryClient.mockImplementation(() => {
              return {
                getNonceFromPriv: jest.fn().mockResolvedValue({
                  nonce: 'foo',
                }),
              }
            })
            input.asset = {
              isNative: jest.fn().mockReturnValue(false),
            }
            warp = new Warp()
            await expect(warp.toStellar(input)).rejects.toThrowError(
              WarpException,
            )
          })
        })

        describe('With error from txToHex', () => {
          it('should throw an error', async () => {
            getStellarClient.mockImplementation(() => {
              return {
                async createWithdrawTx() {
                  return 'foo'
                },
                getSequenceNumberBySecret: jest.fn().mockResolvedValue({
                  sequenceNumber: 1,
                }),
              }
            })
            getWarpContract.mockImplementation(() => {
              return {
                newCreditLockTx: jest.fn().mockReturnValue('bar'),
                txToHex: jest
                  .fn()
                  .mockRejectedValue(new Error('this is an error')),
              }
            })
            getEvryClient.mockImplementation(() => {
              return {
                getNonceFromPriv: jest.fn().mockResolvedValue({
                  nonce: 'foo',
                }),
              }
            })
            input.asset = {
              isNative: jest.fn().mockReturnValue(false),
            }
            warp = new Warp()
            await expect(warp.toStellar(input)).rejects.toThrowError(
              WarpException,
            )
          })
        })
      })

      describe('With rejected toStellar', () => {
        it('should throw an error', async () => {
          getStellarClient.mockImplementation(() => {
            return {
              async createWithdrawTx() {
                return 'foo'
              },
              getSequenceNumberBySecret: jest.fn().mockResolvedValue({
                sequenceNumber: 1,
              }),
            }
          })
          getTransferClient.mockImplementation(() => {
            return {
              toStellar: jest
                .fn()
                .mockRejectedValue(new Error('this is an error')),
            }
          })
          getWarpContract.mockImplementation(() => {
            return {
              newCreditLockTx: jest.fn().mockReturnValue('bar'),
              txToHex: jest.fn().mockReturnValue('foo'),
            }
          })
          getEvryClient.mockImplementation(() => {
            return {
              getNonceFromPriv: jest.fn().mockResolvedValue({
                nonce: 'foo',
              }),
            }
          })
          input.asset = {
            isNative: jest.fn().mockReturnValue(false),
          }
          warp = new Warp()
          await expect(warp.toStellar(input)).rejects.toThrowError(
            WarpException,
          )
        })
      })
    })
  })
})
