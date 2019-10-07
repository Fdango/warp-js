import TransferException from '@/exceptions/transfer'
import { TransferGRPCClient } from './transfer_grpc_web_pb.js'
import { TransferRequest } from './transfer_pb.js'

let tc

/**
 * Registry for creating a transfer instance if not existed.
 * @param {Object}
 * @returns {Transfer}
 */
export function getTransferClient(config) {
  if (!tc) {
    tc = new Transfer(new TransferGRPCClient(`http://${config.grpc.host}`))
  }
  return tc
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
