import grpc from 'grpc';
import {loadSync} from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.resolve() + '/proto/transfer.proto';
const packageDefinition = loadSync(
  PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
const packageDescriptor = grpc.loadPackageDefinition(packageDefinition);

const transfer_proto = packageDescriptor.transfer;

var tc;

/**
 * Returns a Transfer client
 * @param {ClientConfig} config - grpc client configuration
 * @return {Transfer}
 */
export function getTransferClient(config) {
  if (!tc) {
    tc = new Transfer(config);
  }
  return tc;
}

/**
 *  @typedef {Object} Transfer
 *  @property {ClientConfig} config - grpc client config
 *  @property {Object} client - grpc client for transfer
 */
class Transfer {

  /**
   * @constructor
   * @param {ClientConfig} config
   */
  constructor(config) {
    this.client = new transfer_proto
      .TransferService(config.getHost(), config.getSecure());
    this.config = config;
  }

  /**
   *  Transfers a stellar asset to the Evrynet chain
   *  @param {string} xdr - a stellar payment operation XDR
   *  @param {string} evrynetAddress - a recipient's Evrynet address
   **/
  transfer(xdr, evrynetAddress) {
    return new Promise(
      (resolve, reject) => {
        let chan = this.client.ToEvrynet({
          stellarXDR: xdr,
          evrynetAccount: evrynetAddress,
        });
        chan.on('data', data => {
          resolve(data);
        });
        chan.on('error', err => {
          reject(err);
        });
      }
    );
  }
}
