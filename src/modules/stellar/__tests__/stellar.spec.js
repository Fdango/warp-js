import StellarSDK from 'stellar-sdk'
import { Stellar } from '@/modules/stellar/stellar'
import { WhitelistedAsset, getLumensAsset } from '@/entities/asset'
import StellarException from '@/exceptions/stellar'
import Stream from 'stream'

describe('Stellar', () => {
  const sender = 'SBYOQRUXJEMYTSCSBEXRSPX7EXLD3A6ZFUO5OCOU6D7TTLDO2NPBXL52'
  const senderpk = 'GDRB5MQNWBB6LJJE3XO7PGH4KK7WZJZKZ47ABUC5NVSHCZH7VCR4OGII'
  const currentSeq = '1'
  const nextSeq = '2'
  const expectedBalance = '1'
  const mockedCredit = new WhitelistedAsset({
    code: 'XLM',
    issuer: undefined,
    decimal: 3,
  })
  const getBalInput = {
    accountAddress: 'foo',
    asset: mockedCredit,
  }
  const getBalInvalidInput = {
    accountAddress: 'invalid',
    asset: mockedCredit,
  }

  describe('When get a stellar sequence number', () => {
    describe('With invalid input', () => {
      it('should fail to get a stellar sequenceNumber', async () => {
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => {}
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            getSequenceNumber: jest.fn().mockReturnValue(mockedStream),
          }
        })
        const stellar = new Stellar(mockedClient())
        setInterval(function() {
          mockedStream.emit('error', new Error('this is an error'))
        }, 1000)
        await expect(stellar.getSequenceNumber('Bad')).rejects.toThrow(
          StellarException,
        )
      })
    })
    describe('With valid input', () => {
      it('should get a stellar sequenceNumber correctly', async () => {
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => {}
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            getSequenceNumber: jest.fn().mockReturnValue(mockedStream),
          }
        })
        const stellar = new Stellar(mockedClient())
        setInterval(function() {
          mockedStream.emit('data', {
            getSequencenumber: jest.fn().mockReturnValue(currentSeq),
          })
        }, 1000)
        let seq = await stellar.getSequenceNumber(senderpk)
        expect(seq.sequenceNumber).toBe(currentSeq)
      })
    })
  })

  describe('When deposit transaction', () => {
    describe('With valid input', () => {
      it('should create a correct deposit payment transaction', async () => {
        let amount = '100.0000000'
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => {}
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            getSequenceNumber: jest.fn().mockReturnValue(mockedStream),
          }
        })
        const stellar = new Stellar(mockedClient())
        setInterval(function() {
          mockedStream.emit('data', {
            getSequencenumber: jest.fn().mockReturnValue(currentSeq),
          })
        }, 1000)
        let res = await stellar.getSequenceNumber(senderpk)
        const xlm = getLumensAsset()
        let txeB64 = await stellar.createDepositTx({
          src: sender,
          seq: res.sequenceNumber,
          amount,
          asset: xlm.toStellarFormat(),
        })
        let tx = new StellarSDK.Transaction(txeB64)

        // validate sender pk
        expect(tx.source).toBe(senderpk)

        // validate sender seq
        expect(tx.sequence).toBe(nextSeq)

        // validate timeBounds
        expect(tx.timeBounds).toBeUndefined()

        // validate payment operation
        expect(tx.operations.length).toBe(1)

        let paymentOp = tx.operations[0]
        expect(paymentOp.type).toBe('payment')
        expect(paymentOp.source).toBe(senderpk)
        expect(paymentOp.destination).toBe(
          'GAAQ4EOKRV3O5MC42JPREIUYRCTXUE6JLXWHMETM24AFACXWE54FQATQ',
        )
        expect(paymentOp.asset.code).toBe(xlm.getCode())
        expect(paymentOp.asset.issuer).toBe(xlm.issuer)
        expect(paymentOp.amount).toBe(amount)

        // validate signature
        const sigsObj = tx.signatures
        let signatures = sigsObj.map((s) => s)
        expect(signatures.length).toBe(1)
        let kp = StellarSDK.Keypair.fromPublicKey(senderpk)
        expect(kp.verify(tx.hash(), signatures[0].signature())).toBeTruthy()
      })
    })
  })

  describe('When withdraw transaction', () => {
    describe('With valid input', () => {
      it('should create a correct withdraw payment transaction', async () => {
        let amount = '100.0000000'
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => {}
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            getSequenceNumber: jest.fn().mockReturnValue(mockedStream),
          }
        })
        const stellar = new Stellar(mockedClient())
        setInterval(function() {
          mockedStream.emit('data', {
            getSequencenumber: jest.fn().mockReturnValue(currentSeq),
          })
        }, 1000)
        let res = await stellar.getSequenceNumber(senderpk)
        const xlm = getLumensAsset()
        let txeB64 = await stellar.createWithdrawTx({
          src: sender,
          seq: res.sequenceNumber,
          amount,
          asset: xlm.toStellarFormat(),
        })
        let tx = new StellarSDK.Transaction(txeB64)

        // validate sender pk
        expect(tx.source).toBe(senderpk)

        // validate sender seq
        expect(tx.sequence).toBe(nextSeq)

        // validate timeBounds
        expect(tx.timeBounds).toBeUndefined()

        // validate payment operation
        expect(tx.operations.length).toBe(1)

        let paymentOp = tx.operations[0]
        expect(paymentOp.type).toBe('payment')
        expect(paymentOp.source).toBe(
          'GAAQ4EOKRV3O5MC42JPREIUYRCTXUE6JLXWHMETM24AFACXWE54FQATQ',
        )
        expect(paymentOp.destination).toBe(senderpk)
        expect(paymentOp.asset.code).toBe(xlm.getCode())
        expect(paymentOp.asset.issuer).toBe(xlm.issuer)
        expect(paymentOp.amount).toBe(amount)

        // validate signature
        const sigsObj = tx.signatures
        let signatures = sigsObj.map((s) => s)
        expect(signatures.length).toBe(1)
        let kp = StellarSDK.Keypair.fromPublicKey(senderpk)
        expect(kp.verify(tx.hash(), signatures[0].signature())).toBeTruthy()
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
        const stellar = new Stellar(mockedClient())
        setInterval(function() {
          mockedStream.emit('data', {
            getBalance: jest.fn().mockReturnValue(expectedBalance),
          })
        }, 1000)
        let res = await stellar.getAccountBalance(
          getBalInput.accountAddress,
          getBalInput.asset,
        )
        expect(res.balance).toEqual(expectedBalance)
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
        const stellar = new Stellar(mockedClient())
        setInterval(function() {
          mockedStream.emit('error', new Error('this is an error'))
        }, 1000)
        await expect(
          stellar.getAccountBalance(
            getBalInvalidInput.accountAddress,
            getBalInvalidInput.asset,
          ),
        ).rejects.toThrow(StellarException)
      })
    })
  })
})
