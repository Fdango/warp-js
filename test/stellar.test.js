import assert from 'assert';
import path from 'path';

import StellarSDK from 'stellar-sdk';
import {createMockServer} from 'grpc-mock';
import {getStellarClient} from '../src/stellar/stellar.js';
import ClientConfig from '../src/config/config.js';

const PROTO_PATH = path.resolve() + '/proto/stellar.proto';
const host = 'localhost:50051';

describe('Stellar', () => {
  let config = new ClientConfig(host);
  let client = getStellarClient(config);
  let sender = 'SBYOQRUXJEMYTSCSBEXRSPX7EXLD3A6ZFUO5OCOU6D7TTLDO2NPBXL52';
  let senderpk = 'GDRB5MQNWBB6LJJE3XO7PGH4KK7WZJZKZ47ABUC5NVSHCZH7VCR4OGII';
  let currentSeq = '1';
  let nextSeq = '2';

  const mockServer = createMockServer({
    protoPath: PROTO_PATH,
    packageName: "stellar",
    serviceName: "StellarService",
    rules: [

      {
        method: 'GetNextSequenceNumber',
        streamType: 'server',
        stream: [
          {output: {sequenceNumber: currentSeq}},
        ],
        input: {stellarAddress: senderpk}
      },

    ]
  });
  mockServer.listen(host);

  it('should get a stellar sequenceNumber correctly', async () => {
    let seq = await client.getSequenceNumber(senderpk);
    assert(seq.sequenceNumber == currentSeq);
  });

  it('should fail to get a stellar sequenceNumber, invalid input', async () => {
    try {
      await client.getSequenceNumber('Bad');
      assert.fail("it should fail");
    } catch (e) {
      /* handle error */
      assert(e != null);
    }
  });

  it('should create a correct payment transaction', async () => {
    let amount = '100.0000000';
    let asset = StellarSDK.Asset.native();

    let txeB64 = await client.createPayment(sender, amount, asset);
    let tx = new StellarSDK.Transaction(txeB64);

    // validate sender pk
    assert(tx.source == senderpk);

    // validate sender seq
    assert(tx.sequence == nextSeq);

    // validate timeBounds
    assert(tx.timeBounds == undefined);

    // validate payment operation
    const ops = tx.operations;
    assert(ops.length === 1);
    let paymentOp = ops[0];
    assert(paymentOp.type === 'payment');
    assert(paymentOp.destination === 'GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW');
    assert(paymentOp.asset.code == StellarSDK.Asset.native().code);
    assert(paymentOp.asset.issuer == StellarSDK.Asset.native().issuer);
    assert(paymentOp.amount === amount);

    // validate signature
    const sigsObj = tx.signatures;
    let signatures = sigsObj.map((s) => s);
    assert(signatures.length === 1);
    let kp = StellarSDK.Keypair.fromPublicKey(senderpk);
    assert(true === kp.verify(tx.hash(), signatures[0].signature()));
  });

  after(() => {
    mockServer.close(true);
  });

});
