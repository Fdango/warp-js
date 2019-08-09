import getClientRegistryIntance from '@/interfaces/registries/grpc_client'
import config from '@/config/config'
import Web3 from 'web3'
import GRPCConnectorEntitiy from '@/entities/grpc'
import EvrynetException from '@/exceptions/evrynet'
import find from 'lodash/find'
import map from 'lodash/map'
import { WhitelistedAsset } from '@/entities/asset'

const {
  grpc: { EVRYNET },
} = config

// ec represent singleton instance
let ec = []

/**
 * @typedef {import('./entities/asset').WhitelistedAsset} WhitelistedAsset
 * @typedef {import('grpc').Client} GRPCClient
 */

/**
 * Returns a Stellar client
 * @param {Object} [connectionOpts={}] - is options for connection
 * @return {Evrynet}
 */
export function getEvryClient(connectionOpts = {}) {
  const key = JSON.stringify(connectionOpts)
  if (!ec[key]) {
    const evrynetProto = getClientRegistryIntance(EVRYNET)
    const config = new GRPCConnectorEntitiy({
      host: connectionOpts.host,
      isSecure: connectionOpts.isSecure,
    })
    ec[key] = new Evrynet(
      new evrynetProto.EvrynetGRPC(config.getHost(), config.getSecure()),
    )
  }
  return ec[key]
}

/**
 * @typedef Evrynet
 * @property {GRPCClient} client - grpc client
 * @property {Web3} web3 - web3 utility module
 */
export class Evrynet {
  /**
   * @constructor
   * @param {GRPCClient} client - is a grpc client
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
    return new Promise((resolve, reject) => {
      const chan = this.client.GetNonce({ evrynetAddress: address })
      chan.on('data', (data) => {
        resolve(data)
      })
      chan.on('error', (err) => {
        reject(new EvrynetException(null, err.toString()))
      })
    })
  }

  /**
   * Return a set of whitelist assets
   * @returns {Array.<WhitelistedAsset>} array of whitelisted assets
   */
  getWhitelistAssets() {
    return new Promise((resolve, reject) => {
      const chan = this.client.GetWhitelistAssets({})
      chan.on('data', (data) => {
        const assets = map(data.assets, (ech) => {
          return new WhitelistedAsset(ech)
        })
        resolve({ assets })
      })
      chan.on('error', (err) => {
        reject(new EvrynetException(null, err.toString()))
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
  getNonceFromPriv(priv) {
    return new Promise((resolve, reject) => {
      const account = this.web3.eth.accounts.privateKeyToAccount(`0x${priv}`)
      const chan = this.client.GetNonce({ evrynetAddress: account.address })
      chan.on('data', (data) => {
        resolve(data)
      })
      chan.on('error', (err) => {
        reject(new EvrynetException(null, err.toString()))
      })
    })
  }

  /**
   * @param {string} accountAddress - a address of account
   * @param {WhitelistedAsset} asset - asset of payment
   * @returns {string|EvrynetException} balance
   */
  async getAccountBalance(accountAddress, asset) {
    return new Promise((resolve, reject) => {
      const chan = this.client.GetBalance({
        accountAddress,
        asset: {
          code: asset.getCode(),
          issuer: asset.getIssuer(),
          decimal: asset.getDecimal(),
        },
      })
      chan.on('data', (data) => {
        resolve(data)
      })
      chan.on('error', (err) => {
        reject(new EvrynetException(null, err.toString()))
      })
    })
  }
}

export default {
  getEvryClient,
  Evrynet,
}
