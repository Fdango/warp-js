import GRPCConnectorEntitiy from '@/entities/grpc';
import config from '@/config/config'
const {grpc: {DEFAULT_HOST}} = config

describe('Config', () => {
  describe('#no params in contructor', () => {
    let config = new GRPCConnectorEntitiy();
    it('should returns defualt host', () => {
      expect(config.getHost()).toBe(DEFAULT_HOST);
    });
  });

  describe('#with set params in contructor', () => {
    let host = 'foo';
    let config = new GRPCConnectorEntitiy({host});
    it('should returns defualt host', () => {
      expect(config.getHost()).toBe(host);
    });
  });
});
