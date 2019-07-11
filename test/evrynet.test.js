import path from 'path';

import {createMockServer} from 'grpc-mock';
import {getEvryClient, getWarpContract} from '../src/evrynet/evrynet.js';
import ClientConfig from '../src/config/config.js';
import asset from '../src/asset/asset.js';

const PROTO_PATH = path.resolve() + '/proto/evrynet.proto';
const host = 'localhost:50053';

describe('EvryNet', () => {
  var client;
  var mockServer;
  let senderpk = "0x789CA41C61F599ee883eB604c7D616F458dfC606";
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

describe('WarpContract', () => {
  let senderpriv = "eec741cb4f13d6f4c873834bcce86b4059f32f54744a37042969fb37b5f2b4b0";
  let xlm = asset.Lumens();

  test('creating a new lock lumens raw tx', async () => {
    let warp = getWarpContract();
    let tx = await warp.newCreditLockTx(xlm, 10, senderpriv, 0);
    expect(tx.validate()).toBeTruthy();

    let rwtxHex = warp.txToHex(tx);
    expect(rwtxHex).toBeDefined();
  });

  test('creating a new native lock raw tx', async () => {
    let warp = getWarpContract();
    let tx = await warp.newNativeLockTx(10, senderpriv, 0);
    expect(tx.validate()).toBeTruthy();

    let rwtxHex = warp.txToHex(tx);
    expect(rwtxHex).toBeDefined();
  });

  test('creating a new lock raw tx with invalid priv', async () => {
    expect.assertions(1);
    try {
      await getWarpContract()
        .newCreditLockTx(xlm, 10, 'badpriv', '1');
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
  test('creating a new lock raw tx with invalid asset', async () => {
    expect.assertions(1);
    try {
      await getWarpContract()
        .newCreditLockTx(null, 10, senderpriv, '1');
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
  test('creating a new lock raw tx with invalid amount (zero)', async () => {
    expect.assertions(1);
    try {
      await getWarpContract()
        .newCreditLockTx(xlm, 0, senderpriv, '1');
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
  test('creating a new lock raw tx with invalid amount (negative)', async () => {
    expect.assertions(1);
    try {
      await getWarpContract()
        .newCreditLockTx(xlm, -1, senderpriv, '1');
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  test('creating a new native lock raw tx with invalid priv', async () => {
    expect.assertions(1);
    try {
      await getWarpContract()
        .newNativeLockTx(10, 'badpriv', '1');
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
  test('creating a new native lock raw tx with invalid amount (zero)', async () => {
    expect.assertions(1);
    try {
      await getWarpContract()
        .newNativeLockTx(0, senderpriv, '1');
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
  test('creating a new native lock raw tx with invalid amount (negative)', async () => {
    expect.assertions(1);
    try {
      await getWarpContract()
        .newNativeLockTx(-1, senderpriv, '1');
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

});
