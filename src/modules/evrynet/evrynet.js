import Web3 from 'web3'
import GRPCConnectorEntity from '@/entities/grpc'
import EvrynetException from '@/exceptions/evrynet'
import find from 'lodash/find'
import map from 'lodash/map'
import { WhitelistedAsset } from '@/entities/asset'
import { EvrynetGRPCClient } from 'Protos/evrynet_grpc_web_pb'
import { GetNonceRequest, Asset, GetBalanceRequest } from 'Protos/evrynet_pb'
import { Empty } from 'google-protobuf/google/protobuf/empty_pb.js'

// ec represent singleton instance
let ec = []

/**
 * @typedef {import('./entities/asset').WhitelistedAsset} WhitelistedAsset
 */

/**
 * Returns a Stellar client
 * @param {Object} [connectionOpts={}] - is options for connection
 * @return {Evrynet}
 */
export function getEvryClient(connectionOpts = {}) {
  const key = JSON.stringify(connectionOpts)
  if (!ec[key]) {
    const config = new GRPCConnectorEntity({
      host: connectionOpts.host,
    })
    ec[key] = new Evrynet(new EvrynetGRPCClient(`http://${config.host}`))
  }
  return ec[key]
}

/**
 * @typedef Evrynet
 * @property {EvrynetGRPCClient} client - grpc client
 * @property {Web3} web3 - web3 utility module
 */
export class Evrynet {
  /**
   * @constructor
   * @param {EvrynetGRPCClient} client - is a grpc client
   */
  constructor(client) {
    this.client = client
    this.web3 = new Web3()
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
    const account = this.web3.eth.accounts.privateKeyToAccount(`0x${priv}`)
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
  async getAccountBalance(accountAddress, asset) {
    const grpcAsset = new Asset()
    grpcAsset.setCode(asset.code)
    grpcAsset.setIssuer(asset.issuer)
    grpcAsset.setDecimal(asset.decimal)
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
    const account = this.web3.eth.accounts.privateKeyToAccount(
      `0x${privateKey}`,
    )
    return account.address
  }
}

export default {
  getEvryClient,
  Evrynet,
}
