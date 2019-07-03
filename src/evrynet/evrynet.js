import fs from 'fs';
import path from 'path';
import grpc from 'grpc';
import {loadSync} from '@grpc/proto-loader';
import Web3 from 'web3';
const PROTO_PATH = path.resolve() + '/proto/evrynet.proto';
const packageDefinition = loadSync(
  PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
const packageDescriptor = grpc.loadPackageDefinition(packageDefinition);

const evrynet_proto = packageDescriptor.evrynet;

var ec

/**
 * Returns a Stellar client
 * @param {ClientConfig} config - grpc client configuration
 * @return {Evrynet}
 */
export function getEvryClient(config) {
  if (!ec) {
    ec = new Evrynet(config);
  }
  return ec;
}


/**
 * @typedef {Object} Evrynet
 */
class Evrynet {

  /**
   * @constructor
   * @param {ClientConfig} config
   */
  constructor(config) {
    this.client = new evrynet_proto
      .EvrynetGRPC(config.getHost(), config.getSecure());
  }

  /**
   * Creates a new warp contract instance
   * @return {Object} warp contract
   */
  newWarpContract() {
    let web3 = new Web3();
    let abiPath = path.resolve();
    let abi = fs.readFileSync(abiPath + "/abi/abi.json");
    return new web3.eth.Contract(JSON.parse(abi, "address"));
  }

  /**
   * Returns a next sequence number for a given address
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
          reject(err);
        });
      }
    );
  }
}
