import fs from 'fs';
import path from 'path';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import {Transaction} from 'ethereumjs-tx';
import {evrynet, stellar} from '@/config/config'
import WrapContractException from '@/exceptions/warp_contract'
const {DEFAULT_CONTRACT_ADDRESS, GASLIMIT} = evrynet
const {STROOP_OF_ONE_STELLAR} = stellar

let wc;

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

    constructor(contractAddr, ethClient, abi) {
      this.warp = this._newWarpContract(contractAddr, fs.readFileSync(`${path.resolve()}/abi/${abi}.json`));
      this.web3 = ethClient
    }
  
    _newWarpContract(contractAddr, abi) {
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
      const account = this.web3.eth.accounts.privateKeyToAccount(priv);
      if (!asset) {
        throw new WrapContractException(null, 'Invalid Asset')
      }
      if (amount <= 0) {
        throw new WrapContractException(null, 'Amount should be greater than 0')
      }
      let assetHexName = asset.getHexName()
      let bnAmount = new BigNumber(amount).mul(STROOP_OF_ONE_STELLAR).toString();
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
        throw new WrapContractException(null, 'Amount should be greater than 0')
      }
      let bnAmount = new BigNumber(amount).mul(STROOP_OF_ONE_STELLAR).toNumber();
      if (bnAmount <= 0) {
        throw new WrapContractException(null, 'not allow to move evry coin more than 7 decimals')
      }
      let data = this.warp.methods.lockNative().encodeABI();
      let rawTx = {
        nonce: nonce,
        from: account.address,
        to: this.warp.address,
        value: bnAmount,
        gasLimit: GASLIMIT,
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
  