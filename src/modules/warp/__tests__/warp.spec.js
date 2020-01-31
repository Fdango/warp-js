import Warp from '@/modules/warp'
import { getStellarClient } from '@/modules/stellar/stellar'
import { getTransferClient } from '@/modules/transfer/transfer'
import { getEvryClient } from '@/modules/evrynet/evrynet'
import WarpException from '@/exceptions/warp_sdk'

jest.mock('@/modules/transfer/transfer')
jest.mock('@/modules/stellar/stellar')
jest.mock('@/modules/evrynet/evrynet')

describe('Warp SDK', () => {
  let warp
  beforeEach(() => {
    getStellarClient.mockReset()
    getTransferClient.mockReset()
    getEvryClient.mockReset()
  })
  describe('When calling toEvrynet', () => {
    let input = {
      evrynetPriv: 'foo',
      stellarPriv: 'bar',
      amount: '100',
      asset: {},
      evrynetAddress: 'bar',
    }
    describe('When all functions are successfully called', () => {
      const expected = {
        stellarTxHash: 'foo',
        evrynetTxHash: 'bar',
      }
      describe('When asset is input', () => {
        it('should return data object', async () => {
          input.asset = {
            code: 'foo',
            issuer: 'bar',
            toStellarFormat: jest.fn().mockReturnValue(input.asset),
          }
          getStellarClient.mockImplementation(() => {
            return {
              async newLockTransaction() {
                return 'foo'
              },
            }
          })
          getTransferClient.mockImplementation(() => {
            return {
              toEvrynet: jest.fn().mockResolvedValue(expected),
            }
          })
          getEvryClient.mockImplementation(() => {
            return {
              getWhitelistAssetByCode: jest.fn().mockResolvedValue({
                ...input.asset,
                decimal: 1,
              }),
              newUnlockTx: jest.fn().mockReturnValue('bar'),
              txToHex: jest.fn().mockReturnValue('foo'),
            }
          })
          warp = new Warp()
          const res = await warp.toEvrynet(input)
          expect(res).toBeTruthy()
          expect(res).toEqual(expected)
        })
      })
    })

    describe('When errors occur', () => {
      describe('With rejected newLockTransaction', () => {
        it('should throw an error', async () => {
          getStellarClient.mockImplementation(() => {
            return {
              newLockTransaction: jest
                .fn()
                .mockRejectedValue(new Error('this is a error')),
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
          warp = new Warp()
          await expect(warp.toEvrynet(input)).rejects.toThrow(WarpException)
        })
      })

      describe('With error from getWhitelistAssetByCode', () => {
        it('should throw an error', async () => {
          getEvryClient.mockImplementation(() => {
            return {
              getWhitelistAssetByCode: jest.fn().mockReturnValue(null),
            }
          })
          warp = new Warp()
          await expect(warp.toEvrynet(input)).rejects.toThrow(WarpException)
        })
      })

      describe('With error from newUnlockTx', () => {
        it('should throw an error', async () => {
          getStellarClient.mockImplementation(() => {
            return {
              async newLockTransaction() {
                return 'foo'
              },
            }
          })
          getEvryClient.mockImplementation(() => {
            return {
              getWhitelistAssetByCode: jest.fn().mockResolvedValue({
                ...input.asset,
                decimal: 1,
              }),
              newUnlockTx: jest
                .fn()
                .mockRejectedValue(new Error('this is an error')),
            }
          })
          input.asset = {
            toStellarFormat: jest.fn().mockReturnValue(input.asset),
          }
          warp = new Warp()
          await expect(warp.toEvrynet(input)).rejects.toThrowError(
            WarpException,
          )
        })
      })

      describe('With rejected toEvrynet', () => {
        it('should throw an error', async () => {
          getStellarClient.mockImplementation(() => {
            return {
              async newLockTransaction() {
                return 'foo'
              },
            }
          })
          getTransferClient.mockImplementation(() => {
            return {
              toEvrynet: jest
                .fn()
                .mockRejectedValue(new Error('this is an error')),
            }
          })
          getEvryClient.mockImplementation(() => {
            return {
              getWhitelistAssetByCode: jest.fn().mockResolvedValue({
                ...input.asset,
                decimal: 1,
              }),
              newUnlockTx: jest.fn().mockReturnValue('bar'),
              txToHex: jest.fn().mockReturnValue('foo'),
            }
          })
          input.asset = {
            toStellarFormat: jest.fn().mockReturnValue(input.asset),
          }
          warp = new Warp()
          await expect(warp.toEvrynet(input)).rejects.toThrowError(
            WarpException,
          )
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
      describe('When asset is input', () => {
        it('should return data object', async () => {
          input.asset = {
            code: 'foo',
            issuer: 'bar',
            toStellarFormat: jest.fn().mockReturnValue(input.asset),
          }
          getStellarClient.mockImplementation(() => {
            return {
              async newUnlockTransaction() {
                return 'foo'
              },
            }
          })
          getTransferClient.mockImplementation(() => {
            return {
              toStellar: jest.fn().mockResolvedValue(expected),
            }
          })
          getEvryClient.mockImplementation(() => {
            return {
              getWhitelistAssetByCode: jest.fn().mockResolvedValue({
                ...input.asset,
                decimal: 1,
              }),
              newLockTx: jest.fn().mockReturnValue('bar'),
              txToHex: jest.fn().mockReturnValue('foo'),
            }
          })
          warp = new Warp()
          const res = await warp.toStellar(input)
          expect(res).toBeTruthy()
          expect(res).toEqual(expected)
        })
      })
    })

    describe('When some errors occur', () => {
      describe('With rejected newUnlockTransaction', () => {
        it('should throw an error', async () => {
          getStellarClient.mockImplementation(() => {
            return {
              newUnlockTransaction: jest
                .fn()
                .mockRejectedValue(new Error('this is a error')),
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
          input.asset = {
            toStellarFormat: jest.fn().mockReturnValue(input.asset),
          }
          warp = new Warp()
          await expect(warp.toStellar(input)).rejects.toThrow(WarpException)
        })
      })

      describe('With error from getWhitelistAssetByCode', () => {
        it('should throw an error', async () => {
          getEvryClient.mockImplementation(() => {
            return {
              getWhitelistAssetByCode: jest.fn().mockReturnValue(null),
            }
          })
          warp = new Warp()
          await expect(warp.toStellar(input)).rejects.toThrow(WarpException)
        })
      })

      describe('With error from newLockTx', () => {
        it('should throw an error', async () => {
          getStellarClient.mockImplementation(() => {
            return {
              async newUnlockTransaction() {
                return 'foo'
              },
            }
          })
          getEvryClient.mockImplementation(() => {
            return {
              getWhitelistAssetByCode: jest.fn().mockResolvedValue({
                ...input.asset,
                decimal: 1,
              }),
              newLockTx: jest
                .fn()
                .mockRejectedValue(new Error('this is an error')),
            }
          })
          input.asset = {
            toStellarFormat: jest.fn().mockReturnValue(input.asset),
          }
          warp = new Warp()
          await expect(warp.toStellar(input)).rejects.toThrowError(
            WarpException,
          )
        })
      })

      describe('With rejected toStellar', () => {
        it('should throw an error', async () => {
          getStellarClient.mockImplementation(() => {
            return {
              async newUnlockTransaction() {
                return 'foo'
              },
            }
          })
          getTransferClient.mockImplementation(() => {
            return {
              toStellar: jest
                .fn()
                .mockRejectedValue(new Error('this is an error')),
            }
          })
          getEvryClient.mockImplementation(() => {
            return {
              getWhitelistAssetByCode: jest.fn().mockResolvedValue({
                ...input.asset,
                decimal: 1,
              }),
              newLockTx: jest.fn().mockReturnValue('bar'),
              txToHex: jest.fn().mockReturnValue('foo'),
            }
          })
          input.asset = {
            toStellarFormat: jest.fn().mockReturnValue(input.asset),
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
