import EvrynetException from '@/exceptions/evrynet'
import find from 'lodash/find'
import map from 'lodash/map'
import { WhitelistedAsset } from '@/entities/asset'
import { EvrynetGRPCClient } from './evrynet_grpc_web_pb'
import { GetNonceRequest, GetBalanceRequest } from './evrynet_pb'
import { Asset } from '@/modules/warp/common_pb.js'
import { Empty } from 'google-protobuf/google/protobuf/empty_pb.js'
import { web3Instance } from '@/utils'
import { warpABI } from 'ABIs'
import BigNumber from 'bignumber.js'
import { Transaction } from 'ethereumjs-tx'

// ec represent singleton instance
let ec

/**
 * @typedef {import('./entities/asset').WhitelistedAsset} WhitelistedAsset
 * @typedef {import('web3-eth-contract').Contract} Contract
 * @typedef {import('web3')} Web3
 */

/**
 * Returns a Stellar client
 * @param {Object} - is options for connection
 * @return {Evrynet}
 */
export function getEvryClient(config) {
  if (!ec) {
    ec = new Evrynet(new EvrynetGRPCClient(config.grpc.host), config.evrynet)
  }
  return ec
}

/**
 * @typedef Evrynet
 * @property {EvrynetGRPCClient} client - grpc client
 * @property {Web3} web3 - web3 utility module
 * @property {Contract} warp - warp smart contractjj
 */
export class Evrynet {
  /**
   * @constructor
   * @param {EvrynetGRPCClient} client - is a grpc client
   * @param {object} config - evrynet config
   */
  constructor(client, config) {
    this.client = client
    this.config = config
    this.warp = this._newWarpContract(this.config.contractAddress, warpABI)
  }

  /**
   *
   * @param {string} contractAddr - contract address of warp contract
   * @param {Buffer} abi - abi (interface) for contract
   * @return {Contract|EvrynetException} warp smart contract or exception
   */
  _newWarpContract(contractAddr, abi) {
    try {
      return new web3Instance.eth.Contract(abi, contractAddr)
    } catch (e) {
      throw new EvrynetException(
        null,
        'Unable to lock a credit',
        e.toString(),
      )
    }
  }

  /**
   * Returns a nonce for a given address
   * @param {string} address - evrynet address to get a nonce
   * @returns {Object|EvrynetException} nounce object
   */
  getNonce(address) {
    const request = new GetNonceRequest()
    request.setEvrynetaddress(address)
    return new Promise((resolve, reject) => {
      const chan = this.client.getNonce(request, {})
      chan.on('data', (data) => {
        resolve({ nonce: data.getNonce() })
      })
      chan.on('error', (err) => {
        reject(new EvrynetException(null, err.message))
      })
    })
  }

  /**
   * Return a set of whitelist assets
   * @returns {Array.<WhitelistedAsset>} array of whitelisted assets
   */
  getWhitelistAssets() {
    const empty = new Empty()
    return new Promise((resolve, reject) => {
      const chan = this.client.getWhitelistAssets(empty, {})
      chan.on('data', (data) => {
        const assets = map(data.getAssetsList(), (ech) => {
          return new WhitelistedAsset({
            code: ech.getCode(),
            issuer: ech.getIssuer(),
            decimal: ech.getDecimal(),
            typeID: ech.getTypeid(),
          })
        })
        resolve({ assets })
      })
      chan.on('error', (err) => {
        reject(new EvrynetException(null, err.message))
      })
    })
  }

  /**
   * Return an asset of specified code
   * @param {Asset} asset - asset of to be fetched from whitelisted
   * @returns {WhitelistedAsset} asset
   */
  async getWhitelistAssetByCode(asset) {
    try {
      const data = await this.getWhitelistAssets()
      return find(data.assets, {
        code: asset.getCode(),
        issuer: asset.getIssuer(),
      })
    } catch (e) {
      throw new EvrynetException(null, e.toString())
    }
  }

  /**
   * Returns a nonce for a given address
   * @param {string} priv - evrynet private key to get a nonce
   * @returns {Object|EvrynetException} nounce object
   */
  async getNonceFromPriv(priv) {
    const account = web3Instance.eth.accounts.privateKeyToAccount(`0x${priv}`)
    try {
      const data = await this.getNonce(account.address)
      return data
    } catch (e) {
      throw new EvrynetException(null, e.toString())
    }
  }

  /**
   * @param {string} accountAddress - a address of account
   * @param {WhitelistedAsset} asset - asset of payment
   * @returns {string|EvrynetException} balance
   */
  async getBalance(accountAddress, asset) {
    const grpcAsset = new Asset()
    grpcAsset.setCode(asset.code)
    grpcAsset.setIssuer(asset.issuer)
    grpcAsset.setDecimal(asset.decimal)
    grpcAsset.setTypeid(asset.typeID)
    const grpcRequest = new GetBalanceRequest()
    grpcRequest.setAsset(grpcAsset)
    grpcRequest.setAccountaddress(accountAddress)
    return new Promise((resolve, reject) => {
      const chan = this.client.getBalance(grpcRequest, {})
      chan.on('data', (data) => {
        resolve({ balance: data.getBalance() })
      })
      chan.on('error', (err) => {
        reject(new EvrynetException(null, err.message))
      })
    })
  }

  /**
   *
   * @param {string} privateKey - private key
   * @returns {string} public key
   */
  getPublickeyFromPrivateKey(privateKey = '') {
    const account = web3Instance.eth.accounts.privateKeyToAccount(
      `0x${privateKey}`,
    )
    return account.address
  }

  /**
   * Creates a new credit lock transaction
   * @param {Object} payload - payload for creating tx
   * @param {WhitelistedAsset} payload.asset - asset to be locked
   * @param {string} payload.amount - amount of the asset to be locked
   * @param {string} payload.priv - destination account private key
   * @return {Transaction|EvrynetException} raw tx
   */
  async newLockTx({ asset, amount, priv }) {
    try {
      const account = web3Instance.eth.accounts.privateKeyToAccount(`0x${priv}`)
      if (!asset) {
        throw new EvrynetException(null, 'Invalid Asset')
      }
      if (!this._validateAmount(amount, asset.decimal)) {
        throw new EvrynetException(
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
      const nonceRes = await this.getNonceFromPriv(priv)
      let tx = new Transaction(
        {
          nonce: Number(nonceRes.nonce),
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
      throw new EvrynetException(
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
   * @return {Transaction|EvrynetException} raw tx
   */
  async newLockNativeTx({ amount, priv }) {
    try {
      const account = web3Instance.eth.accounts.privateKeyToAccount(`0x${priv}`)
      if (!this._validateAmount(amount, this.config.atomicEvryDecimalUnit)) {
        throw new EvrynetException(
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
      const nonceRes = await this.getNonceFromPriv(priv)
      let tx = new Transaction(
        {
          nonce: Number(nonceRes.nonce),
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
      throw new EvrynetException(
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
   * @return {Transaction|EvrynetException} raw tx
   */
  async newUnlockTx({ asset, amount, priv }) {
    try {
      const account = web3Instance.eth.accounts.privateKeyToAccount(`0x${priv}`)
      if (!asset) {
        throw new EvrynetException(null, 'Invalid Asset')
      }
      if (!this._validateAmount(amount, asset.decimal)) {
        throw new EvrynetException(
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
      const nonceRes = await this.getNonceFromPriv(priv)
      let tx = new Transaction(
        {
          nonce: Number(nonceRes.nonce),
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
      throw new EvrynetException(
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
   * @return {Transaction|EvrynetException} raw tx
   */
  async newUnlockNativeTx({ amount, priv }) {
    try {
      const account = web3Instance.eth.accounts.privateKeyToAccount(`0x${priv}`)
      if (!this._validateAmount(amount, this.config.atomicEvryDecimalUnit)) {
        throw new EvrynetException(
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
      const nonceRes = await this.getNonceFromPriv(priv)
      let tx = new Transaction(
        {
          nonce: Number(nonceRes.nonce),
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
      throw new EvrynetException(
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
   * @returns {string|EvrynetException}
   */
  txToHex(tx) {
    try {
      return Buffer.from(tx.serialize(), 'hex').toString('hex')
    } catch (e) {
      throw new EvrynetException(
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
  getEvryClient,
  Evrynet,
}
