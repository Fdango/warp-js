import fs from 'fs';
import path from 'path';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import {Transaction} from 'ethereumjs-tx';
const stellarOne = Math.pow(10, 7)
import {DEFAULT_CONTRACT_ADDRESS} from '@/config/evrynet/address'

var wc;

export function getWarpContract(address) {
  if (!wc) {
    wc = new WarpContract(address || DEFAULT_CONTRACT_ADDRESS, new Web3());
  }
  return wc;
}

/**
 * @typedef WarpContract
 */
export class WarpContract {

    constructor(contractAddr, ethClient) {
      this.warp = this._newWarpContract(contractAddr);
      this.web3 = ethClient
    }
  
    _newWarpContract(contractAddr) {
      let abiPath = path.resolve();
      let abi = fs.readFileSync(`${abiPath}/abi/warpABI.json`);
      return new this.web3.eth.Contract(JSON.parse(abi), contractAddr);
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
      let account = this.web3.eth.accounts.privateKeyToAccount(priv);
      if (!asset) {
        throw ('invalid asset');
      }
      if (amount <= 0) {
        throw ('invalid amount, it should greater than 0');
      }
      let assetHexName = asset.getHexName()
      let bnAmount = new BigNumber(amount).mul(stellarOne).toString();
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
      let account = this.web3.eth.accounts.privateKeyToAccount(priv);
      if (amount <= 0) {
        throw ('invalid amount, it should greater than 0');
      }
      let bnAmount = new BigNumber(amount).mul(stellarOne).toNumber();
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
  