import GRPCConnectorEntity from '@/entities/grpc'
import TransferException from '@/exceptions/transfer'
import { TransferGRPCClient } from 'Protos/transfer_grpc_web_pb.js'
import { TransferRequest } from 'Protos/transfer_pb.js'

let tc = []

/**
 * Registry for creating a transfer instance if not existed.
 * @param {Object} [connectionOpts={}]
 * @returns {Transfer}
 */
export function getTransferClient(connectionOpts = {}) {
  const key = JSON.stringify(connectionOpts)
  if (!tc[key]) {
    const config = new GRPCConnectorEntity({
      host: connectionOpts.host,
    })
    tc[key] = new Transfer(new TransferGRPCClient(`http://${config.host}`))
  }
  return tc[key]
}

/**
 *  @typedef {Object} Transfer
 *  @property {TransferGRPCClient} client - grpc client
 */
export class Transfer {
  /**
   * @constructor
   * @param {TransferGRPCClient} client
   */
  constructor(client) {
    this.client = client
  }

  /**
   *  Transfers a stellar asset to the Evrynet chain
   *  @param {string} xdr - a stellar payment operation XDR
   *  @param {string} rawTx - a recipient's Evrynet address
   *  @returns {Object|TransferException} response from API (stellar and evrynet tx hash)
   **/
  toEvrynet(rawTx, xdr) {
    const request = new TransferRequest()
    request.setEvrynetrawtx(rawTx)
    request.setStellarxdr(xdr)
    return new Promise((resolve, reject) => {
      let chan = this.client.toEvrynet(request, {})
      chan.on('data', (data) => {
        resolve({
          stellarTxHash: data.getStellartxhash(),
          evrynetTxHash: data.getEvrynettxhash(),
        })
      })
      chan.on('error', (err) => {
        reject(new TransferException(null, err.message))
      })
    })
  }

  /**
   *  Transfers a stellar asset to the Evrynet chain
   *  @param {string} xdr - a stellar payment operation XDR
   *  @param {string} rawTx - a recipient's Evrynet address
   *  @returns {Object|TransferException} response from API (stellar and evrynet tx hash)
   **/
  toStellar(rawTx, xdr) {
    const request = new TransferRequest()
    request.setEvrynetrawtx(rawTx)
    request.setStellarxdr(xdr)
    return new Promise((resolve, reject) => {
      let chan = this.client.toStellar(request, {})
      chan.on('data', (data) => {
        resolve({
          stellarTxHash: data.getStellartxhash(),
          evrynetTxHash: data.getEvrynettxhash(),
        })
      })
      chan.on('error', (err) => {
        reject(new TransferException(null, err.message))
      })
    })
  }
}

export default {
  getTransferClient,
  Transfer,
}
