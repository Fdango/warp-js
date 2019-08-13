import { getWarpContract, WarpContract } from '@/modules/contract/warp'
import { WhitelistedAsset } from '@/entities/asset'
import WrapContractException from '@/exceptions/warp_contract'
import config from '@/config/config'

const {
  contract: {
    ABI: { WARP },
  },
} = config

describe('WarpContract', () => {
  const senderpriv =
    'eec741cb4f13d6f4c873834bcce86b4059f32f54744a37042969fb37b5f2b4b0'

  describe('When creating new lock credit raw tx', () => {
    describe('When success', () => {
      describe('When credit decimal is less than stellar atomic decimal unit', () => {
        it('should be successfully creating a new lock credit raw tx', () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 6,
          })
          const warp = getWarpContract()
          const tx = warp.newCreditLockTx({
            asset,
            amount: '10',
            priv: senderpriv,
            nonce: 0,
          })
          expect(tx.validate()).toBeTruthy()
          const rwtxHex = warp.txToHex(tx)
          expect(rwtxHex).toBeDefined()
        })
      })

      describe('When credit decimal is more than stellar atomic decimal unit', () => {
        it('should be successfully creating a new lock credit raw tx', () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 10,
          })
          const warp = getWarpContract()
          const tx = warp.newCreditLockTx({
            asset,
            amount: '10',
            priv: senderpriv,
            nonce: 0,
          })
          expect(tx.validate()).toBeTruthy()
          const rwtxHex = warp.txToHex(tx)
          expect(rwtxHex).toBeDefined()
        })
      })
    })

    describe('When error', () => {
      describe('When contract address not found', () => {
        it('should throw an error', async () => {
          try {
            new WarpContract('foo', WARP)
          } catch (e) {
            expect(e).toBeInstanceOf(WrapContractException)
          }
        })
      })

      describe('With invalid private key', () => {
        it('should throw an error from creating a new lock raw tx', () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 7,
          })
          expect(() => {
            getWarpContract().newCreditLockTx({
              asset,
              amount: '10',
              priv: 'badpriv',
              nonce: '1',
            })
          }).toThrow(WrapContractException)
        })
      })

      describe('With invalid amount', () => {
        it('should throw an error from creating a new lock raw tx from zero', () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 7,
          })
          expect(() => {
            getWarpContract().newCreditLockTx({
              asset,
              amount: '0',
              priv: senderpriv,
              nonce: '1',
            })
          }).toThrow(WrapContractException)
        })

        it('should throw an error from creating a new lock raw tx from negative', () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 7,
          })
          expect(() => {
            getWarpContract().newCreditLockTx({
              asset,
              amount: '-1',
              priv: senderpriv,
              nonce: '1',
            })
          }).toThrow(WrapContractException)
        })

        it('should throw an error from creating a new lock raw tx from invalid decimal', () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 8,
          })
          expect(() => {
            getWarpContract().newCreditLockTx({
              asset,
              amount: '1.00000001',
              priv: senderpriv,
              nonce: '1',
            })
          }).toThrow(WrapContractException)
        })
      })
    })
  })

  describe('When creating new native lock raw tx', () => {
    describe('When success', () => {
      it('should be successfully creating a new native lock raw tx', async () => {
        const asset = new WhitelistedAsset({
          code: 'TEST',
          isser: '',
          decimal: 7,
        })
        let warp = getWarpContract()
        let tx = await warp.newNativeLockTx({
          asset,
          amount: 10,
          priv: senderpriv,
          nonce: 0,
        })
        expect(tx.validate()).toBeTruthy()

        let rwtxHex = warp.txToHex(tx)
        expect(rwtxHex).toBeDefined()
      })
    })

    describe('When error', () => {
      describe('With invalid asset', () => {
        it('should throw an error from creating a new lock raw tx', async () => {
          try {
            await getWarpContract().newCreditLockTx({
              asset: null,
              amount: 10,
              priv: senderpriv,
              nonce: '1',
            })
          } catch (e) {
            expect(e).toBeInstanceOf(WrapContractException)
          }
        })
      })

      describe('With invalid private key', () => {
        it('should throw an error from creating a new native lock raw tx', async () => {
          try {
            await getWarpContract().newNativeLockTx(10, 'badpriv', '1')
          } catch (e) {
            expect(e).toBeInstanceOf(WrapContractException)
          }
        })
      })

      describe('With invalid amount', () => {
        it('should throw an error from creating a new native lock raw tx using zero', async () => {
          try {
            await getWarpContract().newNativeLockTx(0, senderpriv, '1')
          } catch (e) {
            expect(e).toBeInstanceOf(WrapContractException)
          }
        })

        it('should throw an error from creating a new native lock raw tx using negative', async () => {
          expect.assertions(1)
          try {
            await getWarpContract().newNativeLockTx(-1, senderpriv, '1')
          } catch (e) {
            expect(e).toBeInstanceOf(WrapContractException)
          }
        })
      })
    })
  })

  describe('Validate amount', () => {
    describe('When amount is valid', () => {
      describe('When decimal is less than stellar decimal unit', () => {
        it('Should return true on validation', () => {
          expect(getWarpContract()._validateAmount('10.0000001', 10)).toBe(true)
        })
      })
      describe('When decimal is less than stellar decimal unit', () => {
        it('Should return true on validation', () => {
          expect(getWarpContract()._validateAmount('10.0000010', 6)).toBe(true)
        })
      })
    })
    describe('When amount is invalid', () => {
      describe('When decimal is less than stellar decimal unit', () => {
        it('Should return true on validation', () => {
          expect(getWarpContract()._validateAmount('10.00000001', 10)).toBe(
            false,
          )
        })
      })
      describe('When decimal is less than stellar decimal unit', () => {
        it('Should return true on validation', () => {
          expect(getWarpContract()._validateAmount('10.0000011', 6)).toBe(false)
        })
      })
    })
  })
})
