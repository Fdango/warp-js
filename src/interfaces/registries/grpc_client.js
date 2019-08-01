import path from 'path'
import grpc from 'grpc'
import { loadSync } from '@grpc/proto-loader'
import GRPCRegistryException from '@/exceptions/grpc_registry'

let registry = []
/**
 * Registry for getting GRPC client using each client name as a key.
 * @param  {string} client - GRPC client's name.
 * @returns {grpc.GrpcObject} - GRPC client object
 */
export default function getClientRegistryIntance(client) {
  if (!registry[client]) {
    try {
      const PROTO_PATH = `${path.resolve()}/proto/${client}.proto`
      const packageDefinition = loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      })
      const packageDescriptor = grpc.loadPackageDefinition(packageDefinition)
      registry[client] = packageDescriptor[client]
    } catch (e) {
      throw new GRPCRegistryException(
        null,
        e.message,
        'Unable to create a grpc client registry',
      )
    }
  }
  return registry[client]
}
