import NetworkException from '@/exceptions/transfer'
import { Net } from '@/modules/net/net'

describe('Net', () => {
  describe('When calling isListening', () => {
    describe('With valid input', () => {
      it('should make a ToEvrynet request correctly', async () => {
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            check: jest.fn().mockImplementation((req, meta, callback) => {
              callback(null, {
                getStatus: jest.fn().mockReturnValue(1),
              })
            }),
          }
        })
        const net = new Net({ healthClient: mockedClient() })
        const res = await net.isListening()
        expect(res).toBe(true)
      })
    })

    describe('With invalid input', () => {
      it('should make a ToEvrynet request correctly', async () => {
        const mockedClient = jest.fn().mockImplementation(() => {
          return {
            check: jest.fn().mockImplementation((req, meta, callback) => {
              callback(new Error('this is an error'), null)
            }),
          }
        })
        const net = new Net({ healthClient: mockedClient() })
        net.isListening().catch((e) => {
          expect(e).toMatch(NetworkException)
          expect(e.message).toBe('this is an error')
        })
      })
    })
  })
})
