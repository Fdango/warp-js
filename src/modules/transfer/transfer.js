import getClientRegistryIntance from '@/interfaces/registries/grpc_client'
import config from '@/config/config'
import GRPCConnectorEntitiy from '@/entities/grpc'
import TransferException from '@/exceptions/transfer'

const {
  grpc: { TRANSFER },
} = config

let tc = []

/**
 * @typedef {import('grpc').Client} GRPCClient
 */

/**
 * Registry for creating a transter instance if not existed.
 * @param {Object} [connectionOpts={}]
 * @returns {Transfer}
 */
export function getTransferClient(connectionOpts = {}) {
  const key = JSON.stringify(connectionOpts)
  if (!tc[key]) {
    const transferProto = getClientRegistryIntance(TRANSFER)
    const config = new GRPCConnectorEntitiy({
      host: connectionOpts.host,
      isSecure: connectionOpts.isSecure,
    })
    tc[key] = new Transfer(
      new transferProto.TransferGRPC(config.getHost(), config.getSecure()),
    )
  }
  return tc[key]
}

/**
 *  @typedef {Object} Transfer
 *  @property {GRPCClient} client - grpc client
 */
export class Transfer {
  /**
   * @constructor
   * @param {GRPCClient} client
   */
  constructor(client) {
    this.client = client
  }

  /**
   *  Transfers a stellar asset to the Evrynet chain
   *  @param {string} xdr - a stellar payment operation XDR
   *  @param {string} evrynetAddress - a recipient's Evrynet address
   **/
  ToEvrynet(xdr, evrynetAddress) {
    return new Promise((resolve, reject) => {
      let chan = this.client.ToEvrynet({
        stellarXDR: xdr,
        evrynetAccount: evrynetAddress,
      })
      chan.on('data', (data) => {
        resolve(data)
      })
      chan.on('error', (err) => {
        reject(new TransferException(null, err.message))
      })
    })
  }

  /**
   *  Transfers a stellar asset to the Evrynet chain
   *  @param {string} xdr - a stellar payment operation XDR
   *  @param {string} evrynetAddress - a recipient's Evrynet address
   **/
  ToStellar(evRawTx, stXDR) {
    return new Promise((resolve, reject) => {
      let chan = this.client.ToStellar({
        evrynetRawTx: evRawTx,
        stellarXDR: stXDR,
      })
      chan.on('data', (data) => {
        resolve(data)
      })
      chan.on('error', (err) => {
        reject(new TransferException(null, err.message))
      })
    })
  }
}
