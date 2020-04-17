import TransferException from '@/exceptions/transfer'
import { Transfer } from '@/modules/transfer/transfer'
import Stream from 'stream'

describe('Transfer', () => {
  describe('When make toEvrynetrequest', () => {
    describe('With valid input', () => {
      it('should make a ToEvrynet request correctly', async () => {
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => {}
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            toEvrynet: jest.fn().mockReturnValue(mockedStream),
          }
        })
        const transfer = new Transfer(mockedClient())
        setInterval(function() {
          mockedStream.emit('data', {
            getStellartxhash: jest.fn().mockReturnValue('Foo'),
            getEvrynettxhash: jest.fn().mockReturnValue('Bar'),
          })
        }, 1000)
        let res = await transfer.toEvrynet('Foo', 'Bar')
        expect(res.stellarTxHash).toBe('Foo')
        expect(res.evrynetTxHash).toBe('Bar')
      })
    })
    describe('With invalid input', () => {
      it('should fail to make a ToEvrynet request', async () => {
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => {}
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            toEvrynet: jest.fn().mockReturnValue(mockedStream),
          }
        })
        const transfer = new Transfer(mockedClient())
        setInterval(function() {
          mockedStream.emit('error', new Error('this is an error'))
        }, 1000)
        await expect(transfer.toEvrynet('Bad', 'Bad')).rejects.toThrow(
          TransferException,
        )
      })
    })
  })

  describe('When make ToStellar', () => {
    describe('With valid input', () => {
      it('should make a ToStellar request correctly', async () => {
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => {}
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            toStellar: jest.fn().mockReturnValue(mockedStream),
          }
        })
        const transfer = new Transfer(mockedClient())
        setInterval(function() {
          mockedStream.emit('data', {
            getStellartxhash: jest.fn().mockReturnValue('Foo'),
            getEvrynettxhash: jest.fn().mockReturnValue('Bar'),
          })
        }, 1000)
        let res = await transfer.toStellar('Foo', 'Bar')
        expect(res.stellarTxHash).toBe('Foo')
        expect(res.evrynetTxHash).toBe('Bar')
      })
    })
    describe('With invalid input', () => {
      it('should fail to make a ToStellar request, invalid input', async () => {
        let mockedStream = new Stream.Readable()
        mockedStream._read = () => {}
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            toStellar: jest.fn().mockReturnValue(mockedStream),
          }
        })
        const transfer = new Transfer(mockedClient())
        setInterval(function() {
          mockedStream.emit('error', new Error('this is an error'))
        }, 1000)
        await expect(transfer.toStellar('Bad', 'Bad')).rejects.toThrow(
          TransferException,
        )
      })
    })
  })
})
