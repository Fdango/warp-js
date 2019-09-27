import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { Transaction } from 'ethereumjs-tx'
import config from '@/config/config'
import WrapContractException from '@/exceptions/warp_contract'
import { warpABI } from 'ABIs'

const {
  evrynet: {
    DEFAULT_CONTRACT_ADDRESS,
    GASPRICE,
    ATOMIC_EVRY_DECIMAL_UNIT,
    ATOMIC_STELLAR_DECIMAL_UNIT,
    CUSTOM_CHAIN,
  },
} = config

let wc = []

/**
 * @typedef {import('./entities/asset').WhitelistedAsset} WhitelistedAsset
 * @typedef {import('web3-eth-contract').Contract} Contract
 */

/**
 * A registry for creating warp contract based on abi file and contract address
 * @param {string} address - is a contract address for ethereum
 * @param {string} provider - is a provider for web3
 */
export function getWarpContract(provider, address) {
  const key = address || DEFAULT_CONTRACT_ADDRESS
  const web3Provider = provider || Web3.givenProvider
  if (!wc[key]) {
    wc[key] = new WarpContract(key, warpABI, web3Provider)
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
   * @param {Buffer} abi - abi file containing interface for the contract
   */
  constructor(contractAddr, abi, provider) {
    this._setProvider(provider)
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
      return new this.web3.eth.Contract(abi, contractAddr)
    } catch (e) {
      throw new WrapContractException(
        null,
        'Unable to lock a credit',
        e.toString(),
      )
    }
  }

  _setProvider(provider) {
    this.web3 = new Web3(provider)
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
      const account = this.web3.eth.accounts.privateKeyToAccount(priv)
      if (!asset) {
        throw new WrapContractException(null, 'Invalid Asset')
      }
      if (!this._validateAmount(amount, asset.decimal)) {
        throw new WrapContractException(
          null,
          `Not allow to move evry coin more than ${asset.decimal} decimals`,
        )
      }
      const hexAmount = this.web3.utils.toHex(
        this._parseAmount(amount, asset.decimal),
      )
      const assetID = asset.getID()
      const gasLimit = await this.web3.eth.estimateGas({
        from: account.address,
      })
      const data = this.warp.methods.lock(assetID, hexAmount).encodeABI()
      let tx = new Transaction(
        {
          nonce,
          from: account.address,
          to: this.warp.options.address,
          gasLimit: this.web3.utils.toHex(gasLimit + 1000),
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
      const account = this.web3.eth.accounts.privateKeyToAccount(priv)
      if (!this._validateAmount(amount, ATOMIC_EVRY_DECIMAL_UNIT)) {
        throw new WrapContractException(
          null,
          `Invalid amount: decimal is more than ${ATOMIC_STELLAR_DECIMAL_UNIT}`,
        )
      }
      const hexAmount = this.web3.utils.toHex(
        this._parseAmount(amount, ATOMIC_EVRY_DECIMAL_UNIT),
      )
      const gasLimit = await this.web3.eth.estimateGas({
        from: account.address,
      })
      const data = this.warp.methods.lockNative().encodeABI()
      let tx = new Transaction(
        {
          nonce,
          from: account.address,
          to: this.warp.options.address,
          value: hexAmount,
          gasLimit: this.web3.utils.toHex(gasLimit + 1000),
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
      const account = this.web3.eth.accounts.privateKeyToAccount(`0x${priv}`)
      if (!asset) {
        throw new WrapContractException(null, 'Invalid Asset')
      }
      if (!this._validateAmount(amount, asset.decimal)) {
        throw new WrapContractException(
          null,
          `Not allow to move evrycoin more than ${asset.decimal} decimals`,
        )
      }
      const hexAmount = this.web3.utils.toHex(
        this._parseAmount(amount, asset.decimal),
      )
      const assetID = asset.getID()
      const gasLimit = await this.web3.eth.estimateGas({
        from: account.address,
      })
      const data = this.warp.methods
        .unlock(account.address, assetID, hexAmount)
        .encodeABI()
      let tx = new Transaction(
        {
          nonce,
          from: account.address,
          to: this.warp.options.address,
          gasLimit: this.web3.utils.toHex(gasLimit + 1000),
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
      const account = this.web3.eth.accounts.privateKeyToAccount(`0x${priv}`)
      if (!this._validateAmount(amount, ATOMIC_EVRY_DECIMAL_UNIT)) {
        throw new WrapContractException(
          null,
          `Invalid amount: decimal is more than ${ATOMIC_STELLAR_DECIMAL_UNIT}`,
        )
      }
      const hexAmount = this.web3.utils.toHex(
        this._parseAmount(amount, ATOMIC_EVRY_DECIMAL_UNIT),
      )
      const gasLimit = await this.web3.eth.estimateGas({
        from: account.address,
      })
      const data = this.warp.methods
        .unlockNative(account.address, hexAmount)
        .encodeABI()
      let tx = new Transaction(
        {
          nonce,
          from: account.address,
          to: this.warp.options.address,
          gasLimit: this.web3.utils.toHex(gasLimit + 1000),
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
    if (srcDecimal <= ATOMIC_STELLAR_DECIMAL_UNIT) {
      return moduloer.mod(1).toNumber() === 0
    }
    const moduloand = this._parseAmount(
      1,
      srcDecimal - ATOMIC_STELLAR_DECIMAL_UNIT,
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
}

export default {
  getWarpContract,
  WarpContract,
}
