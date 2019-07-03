import path from 'path';

import StellarSDK from 'stellar-sdk';
import {createMockServer} from 'grpc-mock';
import {getStellarClient} from '../src/stellar/stellar.js';
import ClientConfig from '../src/config/config.js';

const PROTO_PATH = path.resolve() + '/proto/stellar.proto';
const host = 'localhost:50051';

describe('Stellar', () => {
  var client;
  var mockServer;
  let sender = 'SBYOQRUXJEMYTSCSBEXRSPX7EXLD3A6ZFUO5OCOU6D7TTLDO2NPBXL52';
  let senderpk = 'GDRB5MQNWBB6LJJE3XO7PGH4KK7WZJZKZ47ABUC5NVSHCZH7VCR4OGII';
  let currentSeq = '1';
  let nextSeq = '2';

  beforeAll(() => {
    let config = new ClientConfig(host);
    client = getStellarClient(config);

    mockServer = createMockServer({
      protoPath: PROTO_PATH,
      packageName: "stellar",
      serviceName: "StellarGRPC",
      rules: [

        {
          method: 'GetSequenceNumber',
          streamType: 'server',
          stream: [
            {output: {sequenceNumber: currentSeq}},
          ],
          input: {stellarAddress: senderpk}
        },

      ]
    });
    mockServer.listen(host);
  });

  afterAll(() => {
    mockServer.close(true);
  });

  it('should get a stellar sequenceNumber correctly', async () => {
    let seq = await client.getSequenceNumber(senderpk);
    expect(seq.sequenceNumber).toBe(currentSeq);
  });

  it('should fail to get a stellar sequenceNumber, invalid input', async () => {
    await expect(client.getSequenceNumber('Bad')).rejects.toBeDefined();
  });

  it('should create a correct payment transaction', async () => {
    let amount = '100.0000000';
    let asset = StellarSDK.Asset.native();

    let txeB64 = await client.createPayment(sender, amount, asset);
    let tx = new StellarSDK.Transaction(txeB64);

    // validate sender pk
    expect(tx.source).toBe(senderpk);

    // validate sender seq
    expect(tx.sequence).toBe(nextSeq);

    // validate timeBounds
    expect(tx.timeBounds).toBeUndefined();

    // validate payment operation
    const ops = tx.operations;
    expect(ops.length).toBe(1);
    let paymentOp = ops[0];
    expect(paymentOp.type).toBe('payment');
    expect(paymentOp.destination).toBe('GAAQ4EOKRV3O5MC42JPREIUYRCTXUE6JLXWHMETM24AFACXWE54FQATQ');
    expect(paymentOp.asset.code).toBe(StellarSDK.Asset.native().code);
    expect(paymentOp.asset.issuer).toBe(StellarSDK.Asset.native().issuer);
    expect(paymentOp.amount).toBe(amount);

    // validate signature
    const sigsObj = tx.signatures;
    let signatures = sigsObj.map((s) => s);
    expect(signatures.length).toBe(1);
    let kp = StellarSDK.Keypair.fromPublicKey(senderpk);
    expect(kp.verify(tx.hash(), signatures[0].signature())).toBeTruthy();
  });
});
