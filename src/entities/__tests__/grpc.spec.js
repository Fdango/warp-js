import GRPCConnectorEntity from '@/entities/grpc'
import config from '@/config/config'
const {
  grpc: { DEFAULT_HOST },
} = config

describe('GRPC Config', () => {
  describe('When no params in a contructor', () => {
    let config = new GRPCConnectorEntity()
    it('should returns defualt host', () => {
      expect(config.getHost()).toBe(DEFAULT_HOST)
    })
  })

  describe('When set params in a contructor', () => {
    let host = 'foo'
    let config = new GRPCConnectorEntity({ host })
    it('should returns defualt host', () => {
      expect(config.getHost()).toBe(host)
    })
  })
})
