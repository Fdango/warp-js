import fs from 'fs';
import path from 'path';
import grpc from 'grpc';
import {loadSync} from '@grpc/proto-loader';
import Web3 from 'web3';
import {Transaction} from 'ethereumjs-tx';
const PROTO_PATH = path.resolve() + '/proto/evrynet.proto';
const packageDefinition = loadSync(
  PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
const packageDescriptor = grpc.loadPackageDefinition(packageDefinition);

const evrynet_proto = packageDescriptor.evrynet;

const web3 = new Web3();

var ec;

/**
 * Returns a Stellar client
 * @param {ClientConfig} config - grpc client configuration
 * @return {Evrynet}
 */
export function getEvryClient(config) {
  if (!ec) {
    ec = new Evrynet(config);
  }
  return ec;
}

var wc;

export function getWarpContract(address) {
  let _addr = "0x789CA41C61F599ee883eB604c7D616F458dfC606";
  if (address) {
    _addr = address;
  }
  if (!wc) {
    wc = new WarpContract(_addr);
  }
  return wc;
}

/**
 * @typedef {Object} Evrynet
 */
class Evrynet {

  /**
   * @constructor
   * @param {ClientConfig} config
   */
  constructor(config) {
    this.client = new evrynet_proto
      .EvrynetGRPC(config.getHost(), config.getSecure());
  }


  /**
   * Returns a nonce for a given address
   * @param {string} address - evrynet address to get a nonce
   */
  getNonce(address) {
    return new Promise(
      (resolve, reject) => {
        var chan = this.client.GetNonce({evrynetAddress: address});
        chan.on('data', data => {
          resolve(data);
        });
        chan.on('error', err => {
          reject(err);
        });
      }
    );
  }
}

/**
 * @typedef WarpContract
 */
class WarpContract {

  constructor(contractAddr) {
    this.warp = this.newWarpContract(contractAddr);
  }

  /**
     * Creates a new warp contract instance
     * @param {string} contractAddr
     * @return {Object} warp contract
     */
  newWarpContract(contractAddr) {
    let abiPath = path.resolve();
    let abi = fs.readFileSync(abiPath + "/abi/abi.json");
    return new web3.eth.Contract(JSON.parse(abi), contractAddr);
  }

  /**
   * Creates a new credit lock transaction
   * @param {Credit} asset to be locked
   * @param {number} amount of the asset to be locked
   * @param {string} priv key used to sign the tx
   * @param {string} nonce
   * @return {Transaction|error} raw tx
   */
  newCreditLockTx(asset, amount, priv, nonce) {
    let account = web3.eth.accounts.privateKeyToAccount(priv);
    if (!asset) {
      throw ('invalid asset');
    }
    if (amount <= 0) {
      throw ('invalid amount, it should greater than 0');
    }
    let assetHexName = asset.getHexName()
    let data = this.warp.methods.lock(assetHexName, amount).encodeABI();
    let rawTx = {
      nonce: nonce,
      from: account.address,
      gasLimit: 50000,
      to: this.warp.address,
      data: data
    }
    let tx = new Transaction(rawTx);
    tx.sign(Buffer.from(priv, 'hex'));
    return tx;
  }

  /**
   * Converts from tx object to hex string
   * @param {Transaction} tx
   */
  txToHex(tx) {
    return Buffer.from(tx.serialize(), 'hex');
  }

}
