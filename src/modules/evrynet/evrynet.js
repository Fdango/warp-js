import EvrynetException from '@/exceptions/evrynet'
import find from 'lodash/find'
import { WhitelistedAsset } from '@/entities/asset'
import { EvrynetGRPCClient } from './evrynet_grpc_web_pb'
import { GetNonceRequest, GetBalanceRequest } from './evrynet_pb'
import { Asset } from '@/modules/warp/common_pb.js'
import { Empty } from 'google-protobuf/google/protobuf/empty_pb.js'
import { web3Instance } from '@/utils'
import {
  nativeCustodianABI,
  evrynetCustodianABI,
  stellarCustodianABI,
} from 'ABIs'
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
    this.nativeCustodian = this._newContract(
      this.config.contract.nativeCustodian.address,
      nativeCustodianABI,
    )
    this.evrynetCustodian = this._newContract(
      this.config.contract.evrynetCustodian.address,
      evrynetCustodianABI,
    )
    this.stellarCustodian = this._newContract(
      this.config.contract.stellarCustodian.address,
      stellarCustodianABI,
    )
  }

  /**
   *
   * @param {string} contractAddr - contract address of warp contract
   * @param {Buffer} abi - abi (interface) for contract
   * @return {Contract|EvrynetException} warp smart contract or exception
   */
  _newContract(contractAddr, abi) {
    try {
      return new web3Instance.eth.Contract(abi, contractAddr)
    } catch (e) {
      throw new EvrynetException(
        null,
        'Unable to initiate contract',
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
  async getWhitelistAssets() {
    try {
      var data = new Object()
      var assets = new Array()
      const nativeAssets = await this.getNativeAsset()
      const evrynetAssets = await this.getEvrynetAssets()
      const stellarAssets = await this.getStellarAssets()
      assets = assets.concat(
        nativeAssets.asset,
        evrynetAssets.assets,
        stellarAssets.assets,
      )
      data.assets = assets
      return data
    } catch (e) {
      throw new EvrynetException(null, e.toString())
    }
  }

  /**
   * Return a set of whitelist evrynet's assets
   * @returns {Array.<WhitelistedAsset>} array of whitelisted assets
   */
  getEvrynetAssets() {
    const empty = new Empty()
    const assets = new Array()
    return new Promise((resolve, reject) => {
      const chan = this.client.getWhitelistAssets(empty, {})
      chan.on('data', (data) => {
        if (data.getEvrynetcredit() !== undefined) {
          data
            .getEvrynetcredit()
            .getAssetsList()
            .forEach((asset) => {
              assets.push(
                new WhitelistedAsset({
                  code: asset.getCode(),
                  issuer: asset.getIssuer(),
                  decimal: asset.getDecimal(),
                  typeID: asset.getTypeid(),
                }),
              )
            })
        }
        resolve({ assets })
      })
      chan.on('error', (err) => {
        reject(new EvrynetException(null, err.message))
      })
    })
  }

  /**
   * Return a set of whitelist stellar's assets
   * @returns {Array.<WhitelistedAsset>} array of whitelisted assets
   */
  getStellarAssets() {
    const empty = new Empty()
    const assets = new Array()
    return new Promise((resolve, reject) => {
      const chan = this.client.getWhitelistAssets(empty, {})
      chan.on('data', (data) => {
        if (data.getStellarcredit() !== undefined) {
          data
            .getStellarcredit()
            .getAssetsList()
            .forEach((asset) => {
              assets.push(
                new WhitelistedAsset({
                  code: asset.getCode(),
                  issuer: asset.getIssuer(),
                  decimal: asset.getDecimal(),
                  typeID: asset.getTypeid(),
                }),
              )
            })
        }
        resolve({ assets })
      })
      chan.on('error', (err) => {
        reject(new EvrynetException(null, err.message))
      })
    })
  }

  /**
   * Return a set of whitelist native's asset
   * @returns {WhitelistedAsset} whitelisted assets
   */
  getNativeAsset() {
    const empty = new Empty()
    var asset = new Object()
    return new Promise((resolve, reject) => {
      const chan = this.client.getWhitelistAssets(empty, {})
      chan.on('data', (data) => {
        if (data.getNativeasset() !== undefined) {
          const nativeAsset = data.getNativeasset()
          asset = new WhitelistedAsset({
            code: nativeAsset.getCode(),
            issuer: nativeAsset.getIssuer(),
            decimal: nativeAsset.getDecimal(),
            typeID: nativeAsset.getTypeid(),
          })
        }
        resolve({ asset })
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
   * @param {nativeAsset} - native's asset of to be fetched from whitelisted
   * @returns {boolean}
   */
  async isNativeAsset(nativeAsset) {
    try {
      const data = await this.getNativeAsset()
      return (
        nativeAsset.getCode() === data.asset.getCode() &&
        nativeAsset.getIssuer() === data.asset.getIssuer()
      )
    } catch (e) {
      throw new EvrynetException(null, e.toString())
    }
  }

  /**
   * @param {evrynetAsset} - evrynet's asset of to be fetched from whitelisted
   * @returns {boolean}
   */
  async isEvrynetAsset(evrynetAsset) {
    try {
      const data = await this.getEvrynetAssets()
      return find(data.assets, {
        code: evrynetAsset.getCode(),
        issuer: evrynetAsset.getIssuer(),
      }) ? true : false
    } catch (e) {
      throw new EvrynetException(null, e.toString())
    }
  }

  /**
   * @param {stellarAsset} - stellar's asset of to be fetched from whitelisted
   * @returns {boolean}
   */
  async isStellarAsset(stellarAsset) {
    try {
      const data = await this.getStellarAssets()
      return find(data.assets, {
        code: stellarAsset.getCode(),
        issuer: stellarAsset.getIssuer(),
      }) ? true : false
    } catch (e) {
      throw new EvrynetException(null, e.toString())
    }
  }

  /**
   * Returns a nonce for a given address
   * @param {string} secret - evrynet private key to get a nonce
   * @returns {Object|EvrynetException} nounce object
   */
  async getNonceFromPriv(secret) {
    const account = web3Instance.eth.accounts.privateKeyToAccount(`0x${secret}`)
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
   * @param {string} payload.secret - destination account private key
   * @return {Transaction|EvrynetException} raw tx
   */
  async newLockTx({ asset, amount, secret }) {
    try {
      const account = web3Instance.eth.accounts.privateKeyToAccount(
        `0x${secret}`,
      )
      let decimal, hexAmount, method, toAddr
      if (await this.isNativeAsset(asset)) {
        decimal = this.config.atomicEvryDecimalUnit
        method = this.nativeCustodian.methods.lock()
        hexAmount = web3Instance.utils.toHex(this._parseAmount(amount, decimal))
        toAddr = this.nativeCustodian.options.address
      } else {
        decimal = asset.decimal
        hexAmount = web3Instance.utils.toHex(this._parseAmount(amount, decimal))
        if (await this.isEvrynetAsset(asset)) {
          method = this.evrynetCustodian.methods.lock(
            asset.getTypeid(),
            hexAmount,
          )
          toAddr = this.evrynetCustodian.options.address
        } else if (await this.isStellarAsset(asset)) {
          method = this.stellarCustodian.methods.lock(
            asset.getTypeid(),
            hexAmount,
          )
          toAddr = this.stellarCustodian.options.address
        } else {
          throw new EvrynetException(null, 'Invalid Asset')
        }
      }
      if (!this._validateAmount(amount, decimal)) {
        throw new EvrynetException(
          null,
          `Not allow to move evry coin more than ${decimal} decimals`,
        )
      }
      const gasLimit = await this.getGasLimit(
        method,
        account.address,
        hexAmount,
      )
      const data = method.encodeABI()
      const nonceRes = await this.getNonceFromPriv(secret)
      let tx = new Transaction(
        {
          nonce: Number(nonceRes.nonce),
          from: account.address,
          to: toAddr,
          gasLimit: web3Instance.utils.toHex(gasLimit),
          gasPrice: this.config.gasPrice,
          data,
        },
        {
          common: this.config.customChain,
        },
      )
      tx.sign(Buffer.from(secret, 'hex'))
      return tx
    } catch (e) {
      throw new EvrynetException(null, 'Unable to lock a asset', e.toString())
    }
  }

  /**
   * Creates a new credit unlock transaction
   * @param {Object} payload - payload for creating tx
   * @param {WhitelistedAsset} payload.asset - asset to be unlocked
   * @param {string} payload.amount - amount of the asset to be unlocked
   * @param {string} payload.secret - destination account private key
   * @return {Transaction|EvrynetException} raw tx
   */
  async newUnlockTx({ asset, amount, secret }) {
    try {
      const account = web3Instance.eth.accounts.privateKeyToAccount(
        `0x${secret}`,
      )
      let decimal, hexAmount, method, toAddr
      if (await this.isNativeAsset(asset)) {
        decimal = this.config.atomicEvryDecimalUnit
        hexAmount = web3Instance.utils.toHex(this._parseAmount(amount, decimal))
        method = this.nativeCustodian.methods.unlock(account.address, hexAmount)
        toAddr = this.nativeCustodian.options.address
      } else {
        decimal = asset.decimal
        hexAmount = web3Instance.utils.toHex(this._parseAmount(amount, decimal))
        if (await this.isEvrynetAsset(asset)) {
          method = this.evrynetCustodian.methods.unlock(
            asset.getTypeid(),
            hexAmount,
          )
          toAddr = this.evrynetCustodian.options.address
        } else if (await this.isStellarAsset(asset)) {
          method = this.stellarCustodian.methods.unlock(
            asset.getTypeid(),
            hexAmount,
          )
          toAddr = this.stellarCustodian.options.address
        } else {
          throw new EvrynetException(null, 'Invalid Asset')
        }
      }
      if (!this._validateAmount(amount, decimal)) {
        throw new EvrynetException(
          null,
          `Not allow to move evrycoin more than ${asset.decimal} decimals`,
        )
      }
      const gasLimit = await this.getGasLimit(
        method,
        account.address,
        hexAmount,
      )
      const data = method.encodeABI()
      const nonceRes = await this.getNonceFromPriv(secret)
      let tx = new Transaction(
        {
          nonce: Number(nonceRes.nonce),
          from: account.address,
          to: toAddr,
          gasLimit: web3Instance.utils.toHex(gasLimit),
          gasPrice: this.config.gasPrice,
          data,
        },
        {
          common: this.config.customChain,
        },
      )
      tx.sign(Buffer.from(secret, 'hex'))
      return tx
    } catch (e) {
      throw new EvrynetException(
        null,
        'Unable to unlock a asset',
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
      throw new EvrynetException(null, 'Unable to lock a credit', e.toString())
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
