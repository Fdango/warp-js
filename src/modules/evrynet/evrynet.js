import getClientRegistryIntance from '@/interfaces/registries/grpc_client'
import config from '@/config/config'
import Web3 from 'web3';
import GRPCConnectorEntitiy from '@/entities/grpc'
import EvrynetException from '@/exceptions/evrynet'

const {grpc: {EVRYNET}} = config

// ec represent singleton instance 
let ec = [];

/**
 * Returns a Stellar client
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
    ec[key] = new Evrynet(new evrynetProto
      .EvrynetGRPC(config.getHost(), config.getSecure()), new Web3());
  }
  return ec[key];
}

/**
 * @typedef {Object} Evrynet
 */
export class Evrynet {
  /**
   * @constructor
   * @param {Object} client
   * @param {Object} ethclient
   */
  constructor(client, ethclient) {
    this.client = client
    this.web3 = ethclient
  }


  /**
   * Returns a nonce for a given address
   * @param {string} address - evrynet address to get a nonce
   */
  getNonce(address) {
    return new Promise(
      (resolve, reject) => {
        const chan = this.client.GetNonce({evrynetAddress: address});
        chan.on('data', data => {
          resolve(data);
        });
        chan.on('error', err => {
          reject(new EvrynetException(null, err.message));
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
        const account = this.web3.eth.accounts.privateKeyToAccount(`0x${priv}`);
        const chan = this.client.GetNonce({evrynetAddress: account.address});
        chan.on('data', data => {
          resolve(data);
        });
        chan.on('error', err => {
          reject(new EvrynetException(null, err.message));
        });
      }
    );
  }
}

export default {
  getEvryClient,
  Evrynet,
}