import ClientConfig from '../src/config/config.js';

describe('Config', () => {
  describe('#no params in contructor', () => {
    let config = new ClientConfig();
    it('should returns defualt host', () => {
      expect(config.getHost()).toBe('localhost:8080');
    });
  });

  describe('#with set params in contructor', () => {
    let host = 'foo.bar';
    let config = new ClientConfig(host);
    it('should returns defualt host', () => {
      expect(config.getHost()).toBe(host);
    });
  });
});