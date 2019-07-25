import path from 'path';

import {createMockServer} from 'grpc-mock';
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
      packageName: 'transfer',
      serviceName: 'TransferGRPC',
      rules: [

        {
          method: 'ToEvrynet',
          streamType: 'server',
          stream: [
            {output: {stellarTxHash: 'Foo', evrynetTxHash: 'Bar'}},
          ],
          input: {stellarXDR: 'Foo', evrynetAccount: 'Bar'}
        },
        {
          method: 'ToStellar',
          streamType: 'server',
          stream: [
            {output: {stellarTxHash: 'Foo', evrynetTxHash: 'Bar'}},
          ],
          input: {evrynetRawTx: 'Foo', stellarXDR: 'Bar'}
        },

      ]
    });
    mockServer.listen(host);
  });

  afterAll(() => {
    mockServer.close(true);
  });

  it('should make a ToEvrynet request correctly', async () => {
    let res = await client.ToEvrynet('Foo', 'Bar');
    expect(res.stellarTxHash).toBe('Foo');
    expect(res.evrynetTxHash).toBe('Bar');
  });

  it('should fail to make a ToEvrynet request, invalid input', async () => {
    await expect(client.ToEvrynet('Bad', 'Bad')).rejects.toBeDefined();
  });

  it('should make a ToStellar request correctly', async () => {
    let res = await client.ToStellar('Foo', 'Bar');
    expect(res.stellarTxHash).toBe('Foo');
    expect(res.evrynetTxHash).toBe('Bar');
  });

  it('should fail to make a ToStellar request, invalid input', async () => {
    await expect(client.ToStellar('Bad', 'Bad')).rejects.toBeDefined();
  });
});
