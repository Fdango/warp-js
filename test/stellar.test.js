const assert = require('assert');
const {getStellarClient} = require('../src/stellar/stellar.js');
const cf = require('../src/config/config.js');
const {createMockServer} = require("grpc-mock");
const PROTO_PATH = __dirname + '/../proto/stellar.proto';

const host = 'localhost:50051';

describe('Stellar', function() {
  let config = new cf(host);
  let client = getStellarClient(config);
  const mockServer = createMockServer({
    protoPath: PROTO_PATH,
    packageName: "stellar",
    serviceName: "StellarService",
    rules: [

      {
        method: "GetNextSequenceNumber",
        streamType: "server",
        stream: [
          { output: { sequenceNumber: "Bar" } },
        ],
        input: { stellarAddress: "Foo" }
      },

    ]
  });
  mockServer.listen(host);

  it('should get a stellar sequenceNumber correctly', async function() {
    let seq = await client.getSequenceNumber('Foo');
    assert(seq.sequenceNumber == 'Bar');
  });

  it('should fail to get a stellar sequenceNumber, invalid input', async function() {
    try {
      await client.getSequenceNumber('Bad');
      assert.fail("it should fail");
    } catch (e) {
      /* handle error */
      assert(e != null);
    }
  });

  after(function() {
    mockServer.close(true);  
  });

});
