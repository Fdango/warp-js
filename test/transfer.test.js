import path from 'path';

import {createMockServer} from "grpc-mock";
import {getTransferClient} from '../src/transfer/transfer.js';
import cf from '../src/config/config.js';

const PROTO_PATH = path.resolve() + '/proto/transfer.proto';
const host = 'localhost:50052';

describe('Transfer', () => {
  var client;
  var mockServer;
  beforeAll(() => {
    let config = new cf(host);
    client = getTransferClient(config);
    mockServer = createMockServer({
      protoPath: PROTO_PATH,
      packageName: "transfer",
      serviceName: "TransferGRPC",
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
  });

  afterAll(() => {
    mockServer.close(true);
  });

  it('should make a transfer request correctly', async () => {
    let res = await client.transfer("Foo", "Bar");
    expect(res.stellarTxHash).toBe('Foo');
    expect(res.evrynetTxHash).toBe('Bar');
  });

  it('should fail to make a transfer request, invalid input', async () => {
    await expect(client.transfer("Bad", "Bad")).rejects.toBeDefined();
  });
});
