import { getWarpContract } from '@/modules/contract/warp'
import { WhitelistedAsset } from '@/entities/asset'
import WrapContractException from '@/exceptions/warp_contract'
import { warpConfigInstance, WarpConfig, initWarpConfig } from '@/config'
import Ganache from 'ganache-cli'

const warpConfig = new WarpConfig()
warpConfig.evrynet.provider = Ganache.provider()
warpConfig.evrynet.shouldUseEstimatedGas = true
initWarpConfig(warpConfig)

describe('WarpContract', () => {
  const senderpriv =
    'eec741cb4f13d6f4c873834bcce86b4059f32f54744a37042969fb37b5f2b4b0'

  describe('When creating new lock raw tx', () => {
    describe('When success', () => {
      describe('When credit decimal is less than stellar atomic decimal unit', () => {
        it('should be successfully creating a new lock credit raw tx', async () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 6,
          })
          const warp = getWarpContract(warpConfigInstance)
          const tx = await warp.newLockTx({
            asset,
            amount: '10',
            priv: senderpriv,
            nonce: 0,
          })
          expect(tx.verifySignature()).toBeTruthy()
          const rwtxHex = warp.txToHex(tx)
          expect(rwtxHex).toBeDefined()
        })
      })

      describe('When credit decimal is more than stellar atomic decimal unit', () => {
        it('should be successfully creating a new lock credit raw tx', async () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 10,
          })
          const warp = getWarpContract(warpConfigInstance)
          const tx = await warp.newLockTx({
            asset,
            amount: '10',
            priv: senderpriv,
            nonce: 0,
          })
          expect(tx.verifySignature()).toBeTruthy()
          const rwtxHex = warp.txToHex(tx)
          expect(rwtxHex).toBeDefined()
        })
      })
    })

    describe('When error', () => {
      describe('With invalid private key', () => {
        it('should throw an error from creating a new lock raw tx', async () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 7,
          })
          await expect(
            getWarpContract(warpConfigInstance).newLockTx({
              asset,
              amount: '10',
              priv: 'badpriv',
              nonce: '1',
            }),
          ).rejects.toThrow(WrapContractException)
        })
      })

      describe('With invalid amount', () => {
        it('should throw an error from creating a new lock raw tx from zero', async () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 7,
          })
          await expect(
            getWarpContract(warpConfigInstance).newLockTx({
              asset,
              amount: '0',
              priv: senderpriv,
              nonce: '1',
            }),
          ).rejects.toThrow(WrapContractException)
        })

        it('should throw an error from creating a new lock raw tx from negative', async () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 7,
          })
          await expect(
            getWarpContract(warpConfigInstance).newLockTx({
              asset,
              amount: '-1',
              priv: senderpriv,
              nonce: '1',
            }),
          ).rejects.toThrow(WrapContractException)
        })

        it('should throw an error from creating a new lock raw tx from invalid decimal', async () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 8,
          })
          await expect(
            getWarpContract(warpConfigInstance).newLockTx({
              asset,
              amount: '1.00000001',
              priv: senderpriv,
              nonce: '1',
            }),
          ).rejects.toThrow(WrapContractException)
        })
      })
    })
  })

  describe('When creating new lock native raw tx', () => {
    describe('When success', () => {
      it('should be successfully creating a new native lock raw tx', async () => {
        const asset = new WhitelistedAsset({
          code: 'TEST',
          isser: '',
          decimal: 7,
        })
        let warp = getWarpContract(warpConfigInstance)
        let tx = await warp.newLockNativeTx({
          asset,
          amount: 10,
          priv: senderpriv,
          nonce: 0,
        })
        expect(tx.verifySignature()).toBeTruthy()

        let rwtxHex = warp.txToHex(tx)
        expect(rwtxHex).toBeDefined()
      })
    })

    describe('When error', () => {
      describe('With invalid asset', () => {
        it('should throw an error from creating a new lock raw tx', async () => {
          try {
            await getWarpContract(warpConfigInstance).newLockTx({
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
            await getWarpContract(warpConfigInstance).newLockNativeTx(
              10,
              'badpriv',
              '1',
            )
          } catch (e) {
            expect(e).toBeInstanceOf(WrapContractException)
          }
        })
      })

      describe('With invalid amount', () => {
        it('should throw an error from creating a new native lock raw tx using zero', async () => {
          try {
            await getWarpContract(warpConfigInstance).newLockNativeTx(
              0,
              senderpriv,
              '1',
            )
          } catch (e) {
            expect(e).toBeInstanceOf(WrapContractException)
          }
        })

        it('should throw an error from creating a new native lock raw tx using negative', async () => {
          expect.assertions(1)
          try {
            await getWarpContract(warpConfigInstance).newLockNativeTx(
              -1,
              senderpriv,
              '1',
            )
          } catch (e) {
            expect(e).toBeInstanceOf(WrapContractException)
          }
        })
      })
    })
  })

  describe('When creating new unlock raw tx', () => {
    describe('When success', () => {
      describe('When credit decimal is less than stellar atomic decimal unit', () => {
        it('should be successfully creating a new unlock raw tx', async () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 6,
          })
          const warp = getWarpContract(warpConfigInstance)
          const tx = await warp.newUnlockTx({
            asset,
            amount: '10',
            priv: senderpriv,
            nonce: 0,
          })
          expect(tx.verifySignature()).toBeTruthy()
          const rwtxHex = warp.txToHex(tx)
          expect(rwtxHex).toBeDefined()
        })
      })

      describe('When credit decimal is more than stellar atomic decimal unit', () => {
        it('should be successfully creating a new unlock raw tx', async () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 10,
          })
          const warp = getWarpContract(warpConfigInstance)
          const tx = await warp.newUnlockTx({
            asset,
            amount: '10',
            priv: senderpriv,
            nonce: 0,
          })
          expect(tx.verifySignature()).toBeTruthy()
          const rwtxHex = warp.txToHex(tx)
          expect(rwtxHex).toBeDefined()
        })
      })
    })

    describe('When error', () => {
      describe('With invalid private key', () => {
        it('should throw an error from creating a unlock raw tx', async () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 7,
          })
          await expect(
            getWarpContract(warpConfigInstance).newUnlockTx({
              asset,
              amount: '10',
              priv: 'badpriv',
              nonce: '1',
            }),
          ).rejects.toThrow(WrapContractException)
        })
      })

      describe('With invalid amount', () => {
        it('should throw an error from creating a new unlock raw tx from zero', async () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 7,
          })
          await expect(
            getWarpContract(warpConfigInstance).newUnlockTx({
              asset,
              amount: '0',
              priv: senderpriv,
              nonce: '1',
            }),
          ).rejects.toThrow(WrapContractException)
        })

        it('should throw an error from creating a new unlock raw tx from negative', async () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 7,
          })
          await expect(
            getWarpContract(warpConfigInstance).newUnlockTx({
              asset,
              amount: '-1',
              priv: senderpriv,
              nonce: '1',
            }),
          ).rejects.toThrow(WrapContractException)
        })

        it('should throw an error from creating a new unlock raw tx from invalid decimal', async () => {
          const asset = new WhitelistedAsset({
            code: 'TEST',
            isser: '',
            decimal: 8,
          })
          await expect(
            getWarpContract(warpConfigInstance).newUnlockTx({
              asset,
              amount: '1.00000001',
              priv: senderpriv,
              nonce: '1',
            }),
          ).rejects.toThrow(WrapContractException)
        })
      })
    })
  })

  describe('When creating new unlock native raw tx', () => {
    describe('When success', () => {
      it('should be successfully creating a new unlock native raw tx', async () => {
        let warp = getWarpContract(warpConfigInstance)
        let tx = await warp.newUnlockNativeTx({
          amount: 10,
          priv: senderpriv,
          nonce: 0,
        })
        expect(tx.verifySignature()).toBeTruthy()

        let rwtxHex = warp.txToHex(tx)
        expect(rwtxHex).toBeDefined()
      })
    })

    describe('When error', () => {
      describe('With invalid asset', () => {
        it('should throw an error from creating a new unlock native raw tx', async () => {
          try {
            await getWarpContract(warpConfigInstance).newUnlockNativeTx({
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
        it('should throw an error from creating a new unlock native raw tx', async () => {
          try {
            await getWarpContract(warpConfigInstance).newUnlockNativeTx(
              10,
              'badpriv',
              '1',
            )
          } catch (e) {
            expect(e).toBeInstanceOf(WrapContractException)
          }
        })
      })

      describe('With invalid amount', () => {
        it('should throw an error from creating a new unlock native raw tx using zero', async () => {
          try {
            await getWarpContract(warpConfigInstance).newUnlockNativeTx(
              0,
              senderpriv,
              '1',
            )
          } catch (e) {
            expect(e).toBeInstanceOf(WrapContractException)
          }
        })

        it('should throw an error from creating a new unlock native raw tx using negative', async () => {
          expect.assertions(1)
          try {
            await getWarpContract(warpConfigInstance).newUnlockNativeTx(
              -1,
              senderpriv,
              '1',
            )
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
          expect(
            getWarpContract(warpConfigInstance)._validateAmount(
              '10.0000001',
              10,
            ),
          ).toBe(true)
        })
      })
      describe('When decimal is less than stellar decimal unit', () => {
        it('Should return true on validation', () => {
          expect(
            getWarpContract(warpConfigInstance)._validateAmount(
              '10.0000010',
              6,
            ),
          ).toBe(true)
        })
      })
    })
    describe('When amount is invalid', () => {
      describe('When decimal is less than stellar decimal unit', () => {
        it('Should return true on validation', () => {
          expect(
            getWarpContract(warpConfigInstance)._validateAmount(
              '10.00000001',
              10,
            ),
          ).toBe(false)
        })
      })
      describe('When decimal is less than stellar decimal unit', () => {
        it('Should return true on validation', () => {
          expect(
            getWarpContract(warpConfigInstance)._validateAmount(
              '10.0000011',
              6,
            ),
          ).toBe(false)
        })
      })
    })
  })
})
