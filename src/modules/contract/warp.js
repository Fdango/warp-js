import fs from 'fs'
import path from 'path'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { Transaction } from 'ethereumjs-tx'
import config from '@/config/config'
import WrapContractException from '@/exceptions/warp_contract'

const {
  stellar: { STROOP_OF_ONE_STELLAR },
  evrynet: { DEFAULT_CONTRACT_ADDRESS, GASLIMIT, GASPRICE, CUSTOM_CHAIN },
  contract: {
    ABI: { WARP },
  },
} = config

let wc = []

/**
 *
 * @typedef {import('web3-eth-contract').Contract} Contract
 */

/**
 * A registry for creating warp contract based on abi file and contract address
 * @param {string} address - is a contract address for ethereum
 */
export function getWarpContract(address) {
  const key = address || DEFAULT_CONTRACT_ADDRESS
  if (!wc[key]) {
    wc[key] = new WarpContract(
      key,
      fs.readFileSync(`${path.resolve()}/abi/${WARP}.json`),
    )
  }
  return wc[key]
}

/**
 * An adapter class for warp eth smart contract contract.
 * @typedef WarpContract
 * @property {Web3} web3 - web3 utility module
 * @property {Contract} warp - warp smart contract
 */
export class WarpContract {
  /**
   * @constructor
   * @param {string} contractAddr - a contract address
   * @param {Buffer} abi - abi file contaning interface for the contract
   */
  constructor(contractAddr, abi) {
    this.web3 = new Web3()
    this.warp = this._newWarpContract(contractAddr, abi)
  }

  /**
   *
   * @param {string} contractAddr - contract address of warp contract
   * @param {Buffer} abi - abi (interface) for contract
   * @return {Contract|WrapContractException} warp smart contract or exception
   */
  _newWarpContract(contractAddr, abi) {
    try {
      return new this.web3.eth.Contract(JSON.parse(abi), contractAddr)
    } catch (e) {
      throw new WrapContractException(
        null,
        'Unable to lock a credit',
        e.message,
      )
    }
  }

  /**
   * Creates a new credit lock transaction
   * @param {Credit} asset to be locked
   * @param {string} amount of the asset to be locked
   * @param {string} priv key used to sign the tx
   * @param {number} nonce a postitive generated nonce number
   * @return {Transaction|WrapContractException} raw tx
   */
  newCreditLockTx(asset, amount, priv, nonce) {
    try {
      const account = this.web3.eth.accounts.privateKeyToAccount(priv)
      if (!asset) {
        throw new WrapContractException(null, 'Invalid Asset')
      }
      if (amount <= 0) {
        throw new WrapContractException(null, 'Amount should be greater than 0')
      }
      const assetHexName = asset.getHexName()
      const bnAmount = new BigNumber(amount)
        .mul(STROOP_OF_ONE_STELLAR)
        .toString()
      const data = this.warp.methods.lock(assetHexName, bnAmount).encodeABI()
      let tx = new Transaction(
        {
          nonce,
          from: account.address,
          to: this.warp.address,
          gasLimit: GASLIMIT,
          gasPrice: GASPRICE,
          data,
        },
        {
          common: CUSTOM_CHAIN,
        },
      )
      tx.sign(Buffer.from(priv, 'hex'))
      return tx
    } catch (e) {
      throw new WrapContractException(
        null,
        'Unable to lock a credit',
        e.message,
      )
    }
  }

  /**
   * Creates a new native (Evry Coin) lock transaction
   * @param {string} amount of the asset to be locked
   * @param {string} priv key used to sign the tx
   * @param {number} nonce a postitive generated nonce number
   * @return {Transaction|WrapContractException} raw tx
   */
  newNativeLockTx(amount, priv, nonce) {
    try {
      const account = this.web3.eth.accounts.privateKeyToAccount(priv)
      if (amount <= 0) {
        throw new WrapContractException(null, 'Amount should be greater than 0')
      }
      const bnAmount = new BigNumber(amount)
        .mul(STROOP_OF_ONE_STELLAR)
        .toNumber()
      if (bnAmount <= 0) {
        throw new WrapContractException(
          null,
          'not allow to move evry coin more than 7 decimals',
        )
      }
      const data = this.warp.methods.lockNative().encodeABI()
      let tx = new Transaction(
        {
          nonce,
          from: account.address,
          to: this.warp.address,
          value: bnAmount,
          gasLimit: GASLIMIT,
          gasPrice: GASPRICE,
          data,
        },
        {
          common: CUSTOM_CHAIN,
        },
      )
      tx.sign(Buffer.from(priv, 'hex'))
      return tx
    } catch (e) {
      throw new WrapContractException(
        null,
        'Unable to lock a credit',
        e.message,
      )
    }
  }

  /**
   * Converts from tx object to hex string
   * @param {Transaction} tx
   * @returns {string|WrapContractException}
   */
  txToHex(tx) {
    try {
      return Buffer.from(tx.serialize(), 'hex').toString('hex')
    } catch (e) {
      throw new WrapContractException(
        null,
        'Unable to lock a credit',
        e.message,
      )
    }
  }
}

export default {
  getWarpContract,
  WarpContract,
}
