import getClientRegistryIntance from '@/registries/grpc_client'
import {grpc} from '@/config/config'
import Web3 from 'web3';
import GRPCConnectorEntitiy from '@/entities/grpc'
import EvrynetException from '@/exceptions/evrynet'
const {EVRYNET} = grpc


// ec represent singleton instance 
var ec;

/**
 * Returns a Stellar client
 * @return {Evrynet}
 */
export default function getEvryClient() {
  if (!ec) {
    const evrynetProto = getClientRegistryIntance(EVRYNET)
    const config = new GRPCConnectorEntitiy()
    ec = new Evrynet(new evrynetProto
      .EvrynetGRPC(config.getHost(), config.getSecure()), new Web3());
  }
  return ec;
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
        var chan = this.client.GetNonce({evrynetAddress: address});
        chan.on('data', data => {
          resolve(data);
        });
        chan.on('error', err => {
          reject(new EvrynetException(null, err.message()));
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
        let account = this.web3.eth.accounts.privateKeyToAccount(`0x${priv}`);
        var chan = this.client.GetNonce({evrynetAddress: account.address});
        chan.on('data', data => {
          resolve(data);
        });
        chan.on('error', err => {
          reject(new EvrynetException(null, err.message()));
        });
      }
    );
  }
}
