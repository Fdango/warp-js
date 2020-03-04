import { HealthCheckRequest, HealthCheckResponse } from './health_pb.js'
import { HealthClient } from './health_grpc_web_pb.js'
import NetworkException from '@/exceptions/network'

let nc

/**
 * Returns a Net client
 * @return {Net}
 */
export function getNetClient(config) {
  if (!nc) {
    nc = new Net({ healthClient: new HealthClient(config.grpc.host) })
  }
  return nc
}

/**
 * @typedef Net
 */
export class Net {
  /**
   * @constructor
   * @param {Object} client - a payload clients send to create a transaction
   * @param {HealthClient} client.healthClient - a payload clients send to create a transaction
   */
  constructor({ healthClient }) {
    this.healthClient = healthClient
  }

  /**
   * Returns a boolean isListening
   * @param {boolean} isListening - the result indicating if the sdk has listening to api successfully
   * @returns {Object|NetworkException}
   */
  isListening() {
    const request = new HealthCheckRequest()
    request.setService('')
    return new Promise((resolve, reject) => {
      this.healthClient.check(request, null, function(err, response) {
        if (err) {
          reject(new NetworkException(null, err.message))
        } else {
          resolve(
            response.getStatus() === HealthCheckResponse.ServingStatus.SERVING,
          )
        }
      })
    })
  }
}

export default {
  Net,
  getNetClient,
}
