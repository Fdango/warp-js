import { getWarpContract, WarpContract } from '@/modules/contract/warp'
import { getLumensAsset } from '@/entities/asset'
import WrapContractException from '@/exceptions/warp_contract'
import config from '@/config/config'

const {
  contract: {
    ABI: { WARP },
  },
} = config

describe('WarpContract', () => {
  let senderpriv =
    'eec741cb4f13d6f4c873834bcce86b4059f32f54744a37042969fb37b5f2b4b0'
  let xlm = getLumensAsset()

  describe('When creating new lock lumens raw tx', () => {
    it('should be successfully creating a new lock lumens raw tx', async () => {
      let warp = getWarpContract()
      let tx = await warp.newCreditLockTx(xlm, 10, senderpriv, 0)
      expect(tx.validate()).toBeTruthy()

      let rwtxHex = warp.txToHex(tx)
      expect(rwtxHex).toBeDefined()
    })

    describe('When contract address not found', () => {
      it('should throw an error', async () => {
        expect.assertions(1)
        try {
          new WarpContract('foo', WARP)
        } catch (e) {
          expect(e).toBeInstanceOf(WrapContractException)
        }
      })
    })

    describe('With invalid private key', () => {
      it('should throw an error from creating a new lock raw tx', async () => {
        expect.assertions(1)
        try {
          await getWarpContract().newCreditLockTx(xlm, 10, 'badpriv', '1')
        } catch (e) {
          expect(e).toBeInstanceOf(WrapContractException)
        }
      })
    })

    describe('With invalid amount', () => {
      it('should throw an error from creating a new lock raw tx from zero', async () => {
        expect.assertions(1)
        try {
          await getWarpContract().newCreditLockTx(xlm, 0, senderpriv, '1')
        } catch (e) {
          expect(e).toBeInstanceOf(WrapContractException)
        }
      })

      it('should throw an error from creating a new lock raw tx from negative', async () => {
        expect.assertions(1)
        try {
          await getWarpContract().newCreditLockTx(xlm, -1, senderpriv, '1')
        } catch (e) {
          expect(e).toBeInstanceOf(WrapContractException)
        }
      })
    })
  })

  describe('When creating new native lock lumens raw tx', () => {
    it('should be successfully creating a new native lock raw tx', async () => {
      let warp = getWarpContract()
      let tx = await warp.newNativeLockTx(10, senderpriv, 0)
      expect(tx.validate()).toBeTruthy()

      let rwtxHex = warp.txToHex(tx)
      expect(rwtxHex).toBeDefined()
    })

    describe('With invalid asset', () => {
      it('should throw an error from creating a new lock raw tx', async () => {
        expect.assertions(1)
        try {
          await getWarpContract().newCreditLockTx(null, 10, senderpriv, '1')
        } catch (e) {
          expect(e).toBeInstanceOf(WrapContractException)
        }
      })
    })

    describe('With invalid private key', () => {
      it('should throw an error from creating a new native lock raw tx', async () => {
        expect.assertions(1)
        try {
          await getWarpContract().newNativeLockTx(10, 'badpriv', '1')
        } catch (e) {
          expect(e).toBeInstanceOf(WrapContractException)
        }
      })
    })

    describe('With invalid amount', () => {
      it('should throw an error from creating a new native lock raw tx using zero', async () => {
        expect.assertions(1)
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
