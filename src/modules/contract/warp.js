import BigNumber from 'bignumber.js'
import { Transaction } from 'ethereumjs-tx'
import WrapContractException from '@/exceptions/warp_contract'
import { warpABI } from 'ABIs'
import { web3Instance } from '@/utils'

let wc

/**
 * @typedef {import('./entities/asset').WhitelistedAsset} WhitelistedAsset
 * @typedef {import('web3-eth-contract').Contract} Contract
 * @typedef {import('web3')} Web3
 */

/**
 * A registry for creating warp contract based on abi file and contract address
 * @param {string} address - is a contract address for ethereum
 */
export function getWarpContract(config) {
  if (!wc) {
    wc = new WarpContract(config.evrynet)
  }
  return wc
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
   * @param {object} config - evrynet config
   */
  constructor(config) {
    this.config = config
    this.warp = this._newWarpContract(this.config.contractAddress, warpABI)
  }

  /**
   *
   * @param {string} contractAddr - contract address of warp contract
   * @param {Buffer} abi - abi (interface) for contract
   * @return {Contract|WrapContractException} warp smart contract or exception
   */
  _newWarpContract(contractAddr, abi) {
    try {
      return new web3Instance.eth.Contract(abi, contractAddr)
    } catch (e) {
      throw new WrapContractException(
        null,
        'Unable to lock a credit',
        e.toString(),
      )
    }
  }

  /**
   * Creates a new credit lock transaction
   * @param {Object} payload - payload for creating tx
   * @param {WhitelistedAsset} payload.asset - asset to be locked
   * @param {string} payload.amount - amount of the asset to be locked
   * @param {string} payload.priv - destination account private key
   * @param {number} payload.nonce - positive generated nonce number
   * @return {Transaction|WrapContractException} raw tx
   */
  async newLockTx({ asset, amount, priv, nonce }) {
    try {
      const account = web3Instance.eth.accounts.privateKeyToAccount(`0x${priv}`)
      if (!asset) {
        throw new WrapContractException(null, 'Invalid Asset')
      }
      if (!this._validateAmount(amount, asset.decimal)) {
        throw new WrapContractException(
          null,
          `Not allow to move evry coin more than ${asset.decimal} decimals`,
        )
      }
      const hexAmount = web3Instance.utils.toHex(
        this._parseAmount(amount, asset.decimal),
      )
      const assetID = asset.getID()
      const method = this.warp.methods.lock(assetID, hexAmount)
      const gasLimit = await this.getGasLimit(
        method,
        account.address,
        hexAmount,
      )
      const data = method.encodeABI()
      let tx = new Transaction(
        {
          nonce,
          from: account.address,
          to: this.warp.options.address,
          gasLimit: web3Instance.utils.toHex(gasLimit),
          gasPrice: this.config.gasPrice,
          data,
        },
        {
          common: this.config.customChain,
        },
      )
      tx.sign(Buffer.from(priv, 'hex'))
      return tx
    } catch (e) {
      throw new WrapContractException(
        null,
        'Unable to lock a credit',
        e.toString(),
      )
    }
  }

  /**
   * Creates a new native (Evrycoin) lock transaction
   * @param {Object} payload - payload for creating tx
   * @param {string} payload.amount - amount of the native asset to be locked
   * @param {string} payload.priv - destination account private key
   * @param {number} payload.nonce - positive generated nonce number
   * @return {Transaction|WrapContractException} raw tx
   */
  async newLockNativeTx({ amount, priv, nonce }) {
    try {
      const account = web3Instance.eth.accounts.privateKeyToAccount(`0x${priv}`)
      if (!this._validateAmount(amount, this.config.atomicEvryDecimalUnit)) {
        throw new WrapContractException(
          null,
          `Invalid amount: decimal is more than ${this.config.atomicStellarDecimalUnit}`,
        )
      }
      const hexAmount = web3Instance.utils.toHex(
        this._parseAmount(amount, this.config.atomicEvryDecimalUnit),
      )
      const method = this.warp.methods.lockNative()
      const gasLimit = await this.getGasLimit(
        method,
        account.address,
        hexAmount,
      )
      const data = method.encodeABI()
      let tx = new Transaction(
        {
          nonce,
          from: account.address,
          to: this.warp.options.address,
          value: hexAmount,
          gasLimit: web3Instance.utils.toHex(gasLimit),
          gasPrice: this.config.gasPrice,
          data,
        },
        {
          common: this.config.customChain,
        },
      )
      tx.sign(Buffer.from(priv, 'hex'))
      return tx
    } catch (e) {
      throw new WrapContractException(
        null,
        'Unable to lock a native asset',
        e.toString(),
      )
    }
  }

  /**
   * Creates a new credit unlock transaction
   * @param {Object} payload - payload for creating tx
   * @param {WhitelistedAsset} payload.asset - asset to be unlocked
   * @param {string} payload.amount - amount of the asset to be unlocked
   * @param {string} payload.priv - destination account private key
   * @param {number} payload.nonce - positive generated nonce number
   * @return {Transaction|WrapContractException} raw tx
   */
  async newUnlockTx({ asset, amount, priv, nonce }) {
    try {
      const account = web3Instance.eth.accounts.privateKeyToAccount(`0x${priv}`)
      if (!asset) {
        throw new WrapContractException(null, 'Invalid Asset')
      }
      if (!this._validateAmount(amount, asset.decimal)) {
        throw new WrapContractException(
          null,
          `Not allow to move evrycoin more than ${asset.decimal} decimals`,
        )
      }
      const hexAmount = web3Instance.utils.toHex(
        this._parseAmount(amount, asset.decimal),
      )
      const assetID = asset.getID()
      const method = this.warp.methods.unlock(
        account.address,
        assetID,
        hexAmount,
      )
      const gasLimit = await this.getGasLimit(
        method,
        account.address,
        hexAmount,
      )
      const data = method.encodeABI()
      let tx = new Transaction(
        {
          nonce,
          from: account.address,
          to: this.warp.options.address,
          gasLimit: web3Instance.utils.toHex(gasLimit),
          gasPrice: this.config.gasPrice,
          data,
        },
        {
          common: this.config.customChain,
        },
      )
      tx.sign(Buffer.from(priv, 'hex'))
      return tx
    } catch (e) {
      throw new WrapContractException(
        null,
        'Unable to unlock a credit',
        e.toString(),
      )
    }
  }

  /**
   * Creates a new native (Evrycoin) unlock transaction
   * @param {Object} payload - payload for creating tx
   * @param {string} payload.amount - amount of the native asset to be unlocked
   * @param {string} payload.priv - destination account private key
   * @param {number} payload.nonce - positive generated nonce number
   * @return {Transaction|WrapContractException} raw tx
   */
  async newUnlockNativeTx({ amount, priv, nonce }) {
    try {
      const account = web3Instance.eth.accounts.privateKeyToAccount(`0x${priv}`)
      if (!this._validateAmount(amount, this.config.atomicEvryDecimalUnit)) {
        throw new WrapContractException(
          null,
          `Invalid amount: decimal is more than ${this.config.atomicStellarDecimalUnit}`,
        )
      }
      const hexAmount = web3Instance.utils.toHex(
        this._parseAmount(amount, this.config.atomicEvryDecimalUnit),
      )
      const method = this.warp.methods.unlockNative(account.address, hexAmount)
      const gasLimit = await this.getGasLimit(
        method,
        account.address,
        hexAmount,
      )
      const data = method.encodeABI()
      let tx = new Transaction(
        {
          nonce,
          from: account.address,
          to: this.warp.options.address,
          gasLimit: web3Instance.utils.toHex(gasLimit),
          gasPrice: this.config.gasPrice,
          data,
        },
        {
          common: this.config.customChain,
        },
      )
      tx.sign(Buffer.from(priv, 'hex'))
      return tx
    } catch (e) {
      throw new WrapContractException(
        null,
        'Unable to unlock a native asset',
        e.toString(),
      )
    }
  }

  /**
   * validate amount based on source decimal and stellar atomic decimal unit
   * @param {string} amount
   * @param {number} srcDecimal
   * @return {boolean}
   */
  _validateAmount(amount, srcDecimal) {
    if (!Number(amount) || Number(amount) <= 0) {
      return false
    }
    const moduloer = this._parseAmount(amount, srcDecimal)
    if (srcDecimal <= this.config.atomicStellarDecimalUnit) {
      return moduloer.mod(1).toNumber() === 0
    }
    const moduloand = this._parseAmount(
      1,
      srcDecimal - this.config.atomicStellarDecimalUnit,
    )
    return moduloer.mod(moduloand).toNumber() === 0
  }

  /**
   * parse amount string to big number format
   * @param {string} amount
   * @param {number} srcDecimal
   * @return {BigNumber}
   */
  _parseAmount(amount, decimal) {
    return new BigNumber(amount).shiftedBy(decimal)
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
        e.toString(),
      )
    }
  }

  /**
   * Calculates gas limit
   * @param {Object} method
   * @param {String} sourceAddress
   * @param {String} value
   * @returns {Number}
   */
  async getGasLimit(method, sourceAddress, value) {
    let gasAmount = this.config.shouldUseEstimatedGas
      ? (await method.estimateGas({
          from: sourceAddress,
          value: value,
        })) + 1000
      : this.config.gasLimit
    return gasAmount
  }
}

export default {
  getWarpContract,
  WarpContract,
}
