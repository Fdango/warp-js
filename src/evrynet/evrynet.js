import fs from 'fs';
import path from 'path';
import grpc from 'grpc';
import BigNumber from 'bignumber.js';
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
const StellarOne = Math.pow(10, 7)

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
  let _addr = "0xC7B9e4b1414d61136B1e777CFBe84802435Fd2C8";
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

  /**
   * Returns a nonce for a given address
   * @param {string} priv - evrynet private key to get a nonce
   */
  getNonceFromPriv(priv) {
    return new Promise(
      (resolve, reject) => {
        let account = web3.eth.accounts.privateKeyToAccount('0x' + priv);
        var chan = this.client.GetNonce({evrynetAddress: account.address});
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
    this.warp = this._newWarpContract(contractAddr);
  }

  _newWarpContract(contractAddr) {
    let abiPath = path.resolve();
    let abi = fs.readFileSync(abiPath + "/abi/warpABI.json");
    return new web3.eth.Contract(JSON.parse(abi), contractAddr);
  }

  /**
   * Creates a new credit lock transaction
   * @param {Credit} asset to be locked
   * @param {number} amount of the asset to be locked
   * @param {string} priv key used to sign the tx
   * @param {uint} nonce
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
    let bnAmount = new BigNumber(amount).mul(StellarOne).toString();
    let data = this.warp.methods.lock(assetHexName, bnAmount).encodeABI();
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
     * Creates a new native (Evry Coin) lock transaction
     * @param {number} amount of the asset to be locked
     * @param {string} priv key used to sign the tx
     * @param {uint} nonce
     * @return {Transaction|error} raw tx
     */
  newNativeLockTx(amount, priv, nonce) {
    let account = web3.eth.accounts.privateKeyToAccount(priv);
    if (amount <= 0) {
      throw ('invalid amount, it should greater than 0');
    }
    let bnAmount = new BigNumber(amount).mul(StellarOne).toNumber();
    if (bnAmount <= 0) {
      throw "not allow to move evry coin  less than 7 decimals"
    }
    let data = this.warp.methods.lockNative().encodeABI();
    let rawTx = {
      nonce: nonce,
      from: account.address,
      to: this.warp.address,
      value: bnAmount,
      gasLimit: 50000,
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
    let w = Buffer.from(tx.serialize(), 'hex').toString('hex');
    return w;
  }
}
