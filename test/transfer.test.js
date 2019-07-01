import assert from 'assert';
import path from 'path';

import {createMockServer} from "grpc-mock";
import {getTransferClient} from '../src/transfer/transfer.js';
import cf from '../src/config/config.js';

const PROTO_PATH = path.resolve() + '/proto/transfer.proto';
const host = 'localhost:50052';

describe('Transfer', () => {
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

  it('should make a transfer request correctly', async () => {
    let res = await client.transfer("Foo", "Bar");
    assert(res.stellarTxHash == 'Foo');
    assert(res.evrynetTxHash == 'Bar');
  });

  it('should fail to make a transfer request, invalid input', async () => {
    try {
      await client.transfer("Bad", "Bad");
      assert.fail("it should fail");
    } catch (e) {
      /* handle error */
      assert(e != null);
    }
  });

  after(() => {
    mockServer.close(true);
  });

});
