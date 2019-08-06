import path from 'path'
import StellarSDK from 'stellar-sdk'
import { createMockServer } from 'grpc-mock'
import { getStellarClient } from '@/modules/stellar/stellar'
import { getLumensAsset } from '@/entities/asset'
import StellarException from '@/exceptions/stellar'
import Stream from 'stream'

describe('Stellar', () => {
  let client
  let mockServer
  const sender = 'SBYOQRUXJEMYTSCSBEXRSPX7EXLD3A6ZFUO5OCOU6D7TTLDO2NPBXL52'
  const senderpk = 'GDRB5MQNWBB6LJJE3XO7PGH4KK7WZJZKZ47ABUC5NVSHCZH7VCR4OGII'
  const currentSeq = '1'
  const nextSeq = '2'
  const host = 'localhost:50051'
  const protoPath = `${path.resolve()}/proto/stellar.proto`
  const expectedBalance = '1'
  const mockedCredit = getLumensAsset
  const getBalInput = {
    accountAddress: 'foo',
    asset: {
      code: mockedCredit.asset.GetCode(),
      issuer: mockedCredit.asset.GetIssuer(),
    },
  }

  beforeAll(() => {
    client = getStellarClient({
      host,
    })
    mockServer = createMockServer({
      protoPath: protoPath,
      packageName: 'stellar',
      serviceName: 'StellarGRPC',
      rules: [
        {
          method: 'GetSequenceNumber',
          streamType: 'server',
          stream: [{ output: { sequenceNumber: currentSeq } }],
          input: { stellarAddress: senderpk },
        },
        {
          method: 'GetBalance',
          streamType: 'server',
          stream: [{ output: { balance: expectedBalance } }],
          input: getBalInput,
        },
      ],
    })
    mockServer.listen(host)
  })

  afterAll(() => {
    mockServer.close(true)
  })

  describe('When get a stellar sequence number', () => {
    describe('With invalid input', () => {
      it('should fail to get a stellar sequenceNumber', async () => {
        await expect(client.getSequenceNumber('Bad')).rejects.toThrow(
          StellarException,
        )
      })
    })
    describe('With valid input', () => {
      it('should get a stellar sequenceNumber correctly', async () => {
        let seq = await client.getSequenceNumber(senderpk)
        expect(seq.sequenceNumber).toBe(currentSeq)
      })
    })
  })

  describe('When deposit transaction', () => {
    describe('With valid input', () => {
      it('should create a correct deposit payment transaction', async () => {
        let amount = '100.0000000'
        let res = await client.getSequenceNumber(senderpk)
        const xlm = getLumensAsset()
        let txeB64 = await client.createDepositTx({
          src: sender,
          seq: res.sequenceNumber,
          amount,
          asset: xlm,
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
        expect(paymentOp.asset.code).toBe(xlm.asset.code)
        expect(paymentOp.asset.issuer).toBe(xlm.asset.issuer)
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
        let res = await client.getSequenceNumber(senderpk)
        const xlm = getLumensAsset()
        let txeB64 = await client.createWithdrawTx({
          src: sender,
          seq: res.sequenceNumber,
          amount,
          asset: xlm,
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
        expect(paymentOp.asset.code).toBe(xlm.asset.code)
        expect(paymentOp.asset.issuer).toBe(xlm.asset.issuer)
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
        let res = await client.getAccountBalance('foo', mockedCredit)
        expect(res.balance).toEqual(expectedBalance)
      })
    })
    describe('When a stream emit an error response', () => {
      it('should throw an error', async () => {
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => {}
        client.client.GetBalance = jest.fn().mockReturnValue(mockedStream)
        setInterval(function() {
          mockedStream.emit('error', new Error('this is an error'))
        }, 1000)
        await expect(
          client.getAccountBalance('foo', mockedCredit),
        ).rejects.toThrow(StellarException)
      })
    })
  })
})
