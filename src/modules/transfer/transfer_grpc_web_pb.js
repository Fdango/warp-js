/**
 * @fileoverview gRPC-Web generated client stub for transfer
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!

const grpc = {}
grpc.web = require('grpc-web')

const proto = {}
proto.transfer = require('./transfer_pb.js')

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.transfer.TransferGRPCClient = function(hostname, credentials, options) {
  if (!options) options = {}
  options['format'] = 'text'

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options)

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options
}

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.transfer.TransferGRPCPromiseClient = function(
  hostname,
  credentials,
  options,
) {
  if (!options) options = {}
  options['format'] = 'text'

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options)

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options
}

/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.transfer.TransferRequest,
 *   !proto.transfer.TransferResponse>}
 */
const methodDescriptor_TransferGRPC_ToEvrynet = new grpc.web.MethodDescriptor(
  '/transfer.TransferGRPC/ToEvrynet',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.transfer.TransferRequest,
  proto.transfer.TransferResponse,
  /** @param {!proto.transfer.TransferRequest} request */
  function(request) {
    return request.serializeBinary()
  },
  proto.transfer.TransferResponse.deserializeBinary,
)

/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.transfer.TransferRequest,
 *   !proto.transfer.TransferResponse>}
 */
const methodInfo_TransferGRPC_ToEvrynet = new grpc.web.AbstractClientBase.MethodInfo(
  proto.transfer.TransferResponse,
  /** @param {!proto.transfer.TransferRequest} request */
  function(request) {
    return request.serializeBinary()
  },
  proto.transfer.TransferResponse.deserializeBinary,
)

/**
 * @param {!proto.transfer.TransferRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.transfer.TransferResponse>}
 *     The XHR Node Readable Stream
 */
proto.transfer.TransferGRPCClient.prototype.toEvrynet = function(
  request,
  metadata,
) {
  return this.client_.serverStreaming(
    this.hostname_ + '/transfer.TransferGRPC/ToEvrynet',
    request,
    metadata || {},
    methodDescriptor_TransferGRPC_ToEvrynet,
  )
}

/**
 * @param {!proto.transfer.TransferRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.transfer.TransferResponse>}
 *     The XHR Node Readable Stream
 */
proto.transfer.TransferGRPCPromiseClient.prototype.toEvrynet = function(
  request,
  metadata,
) {
  return this.client_.serverStreaming(
    this.hostname_ + '/transfer.TransferGRPC/ToEvrynet',
    request,
    metadata || {},
    methodDescriptor_TransferGRPC_ToEvrynet,
  )
}

/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.transfer.TransferRequest,
 *   !proto.transfer.TransferResponse>}
 */
const methodDescriptor_TransferGRPC_ToStellar = new grpc.web.MethodDescriptor(
  '/transfer.TransferGRPC/ToStellar',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.transfer.TransferRequest,
  proto.transfer.TransferResponse,
  /** @param {!proto.transfer.TransferRequest} request */
  function(request) {
    return request.serializeBinary()
  },
  proto.transfer.TransferResponse.deserializeBinary,
)

/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.transfer.TransferRequest,
 *   !proto.transfer.TransferResponse>}
 */
const methodInfo_TransferGRPC_ToStellar = new grpc.web.AbstractClientBase.MethodInfo(
  proto.transfer.TransferResponse,
  /** @param {!proto.transfer.TransferRequest} request */
  function(request) {
    return request.serializeBinary()
  },
  proto.transfer.TransferResponse.deserializeBinary,
)

/**
 * @param {!proto.transfer.TransferRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.transfer.TransferResponse>}
 *     The XHR Node Readable Stream
 */
proto.transfer.TransferGRPCClient.prototype.toStellar = function(
  request,
  metadata,
) {
  return this.client_.serverStreaming(
    this.hostname_ + '/transfer.TransferGRPC/ToStellar',
    request,
    metadata || {},
    methodDescriptor_TransferGRPC_ToStellar,
  )
}

/**
 * @param {!proto.transfer.TransferRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.transfer.TransferResponse>}
 *     The XHR Node Readable Stream
 */
proto.transfer.TransferGRPCPromiseClient.prototype.toStellar = function(
  request,
  metadata,
) {
  return this.client_.serverStreaming(
    this.hostname_ + '/transfer.TransferGRPC/ToStellar',
    request,
    metadata || {},
    methodDescriptor_TransferGRPC_ToStellar,
  )
}

module.exports = proto.transfer
