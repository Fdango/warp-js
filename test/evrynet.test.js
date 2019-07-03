import path from 'path';

import {createMockServer} from 'grpc-mock';
import {getEvryClient} from '../src/evrynet/evrynet.js';
import ClientConfig from '../src/config/config.js';

const PROTO_PATH = path.resolve() + '/proto/evrynet.proto';
const host = 'localhost:50053';

describe('EvryNet', () => {
  var client;
  var mockServer;
  let senderpk = "test";
  let currentNonce = '1';

  beforeAll(() => {
    let config = new ClientConfig(host);
    client = getEvryClient(config);

    mockServer = createMockServer({
      protoPath: PROTO_PATH,
      packageName: "evrynet",
      serviceName: "EvrynetGRPC",
      rules: [

        {
          method: 'GetNonce',
          streamType: 'server',
          stream: [
            {output: {nonce: currentNonce}},
          ],
          input: {evrynetAddress: senderpk}
        },

      ]
    });
    mockServer.listen(host);
  });

  afterAll(() => {
    mockServer.close(true);
  });

  it('should get a stellar sequenceNumber correctly', async () => {
    let res = await client.getNonce(senderpk);
    expect(res.nonce).toBe(currentNonce);
  });

  it('should fail to get a stellar sequenceNumber, invalid input', async () => {
    await expect(client.getNonce('Bad')).rejects.toBeDefined();
  });
});
