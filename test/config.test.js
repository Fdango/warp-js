const assert = require('assert');
const cf = require('../src/config/config.js');

describe('Config', function () {
  describe('#no params in contructor', function () {
    let config = new cf();
    it('should returns defualt host', function () {
      assert(config.getHost() == 'localhost:8080');
    });
  });

  describe('#with set params in contructor', function () {
    let host = 'foo.bar';
    let config = new cf(host);
    it('should returns defualt host', function () {
      assert(config.getHost() == host);
    });
  });
});
