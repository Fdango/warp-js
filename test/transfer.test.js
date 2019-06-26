const assert = require('assert');
const {getTransferClient} = require('../src/transfer/transfer.js');
const cf = require('../src/config/config.js');
const {createMockServer} = require("grpc-mock");
const PROTO_PATH = __dirname + '/../proto/transfer.proto';

const host = 'localhost:50052';

describe('Transfer', function () {
  let config = new cf(host);
  let client = getTransferClient(config);
  const mockServer = createMockServer({
    protoPath: PROTO_PATH,
    packageName: "transfer",
    serviceName: "TransferService",
    rules: [

      {
        method: "ToEvrynet",
        streamType: "server",
        stream: [
          {output: {stellarTxHash: "Foo", evrynetTxHash: "Bar"}},
        ],
        input: {stellarXDR: "Foo", evrynetAccount: "Bar"}
      },

    ]
  });
  mockServer.listen(host);

  it('should make a transfer request correctly', async function () {
    let res = await client.transfer("Foo", "Bar");
    assert(res.stellarTxHash == 'Foo');
    assert(res.evrynetTxHash == 'Bar');
  });

  it('should fail to make a transfer request, invalid input', async function () {
    try {
      await client.transfer("Bad", "Bad");
      assert.fail("it should fail");
    } catch (e) {
      /* handle error */
      assert(e != null);
    }
  });

  after(function () {
    mockServer.close(true);
  });

});
