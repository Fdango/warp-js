/**
 * @fileoverview gRPC-Web generated client stub for stellar
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!

const grpc = {}
grpc.web = require('grpc-web')

var warp_common_pb = require('../warp/common_pb.js')
const proto = {}
proto.stellar = require('./stellar_pb.js')

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.stellar.StellarGRPCClient = function(hostname, credentials, options) {
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
proto.stellar.StellarGRPCPromiseClient = function(
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
 *   !proto.stellar.GetSequenceNumberRequest,
 *   !proto.stellar.GetSequenceNumberResponse>}
 */
const methodDescriptor_StellarGRPC_GetSequenceNumber = new grpc.web.MethodDescriptor(
  '/stellar.StellarGRPC/GetSequenceNumber',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.stellar.GetSequenceNumberRequest,
  proto.stellar.GetSequenceNumberResponse,
  /** @param {!proto.stellar.GetSequenceNumberRequest} request */
  function(request) {
    return request.serializeBinary()
  },
  proto.stellar.GetSequenceNumberResponse.deserializeBinary,
)

/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.stellar.GetSequenceNumberRequest,
 *   !proto.stellar.GetSequenceNumberResponse>}
 */
const methodInfo_StellarGRPC_GetSequenceNumber = new grpc.web.AbstractClientBase.MethodInfo(
  proto.stellar.GetSequenceNumberResponse,
  /** @param {!proto.stellar.GetSequenceNumberRequest} request */
  function(request) {
    return request.serializeBinary()
  },
  proto.stellar.GetSequenceNumberResponse.deserializeBinary,
)

/**
 * @param {!proto.stellar.GetSequenceNumberRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.stellar.GetSequenceNumberResponse>}
 *     The XHR Node Readable Stream
 */
proto.stellar.StellarGRPCClient.prototype.getSequenceNumber = function(
  request,
  metadata,
) {
  return this.client_.serverStreaming(
    this.hostname_ + '/stellar.StellarGRPC/GetSequenceNumber',
    request,
    metadata || {},
    methodDescriptor_StellarGRPC_GetSequenceNumber,
  )
}

/**
 * @param {!proto.stellar.GetSequenceNumberRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.stellar.GetSequenceNumberResponse>}
 *     The XHR Node Readable Stream
 */
proto.stellar.StellarGRPCPromiseClient.prototype.getSequenceNumber = function(
  request,
  metadata,
) {
  return this.client_.serverStreaming(
    this.hostname_ + '/stellar.StellarGRPC/GetSequenceNumber',
    request,
    metadata || {},
    methodDescriptor_StellarGRPC_GetSequenceNumber,
  )
}

/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.stellar.GetBalanceRequest,
 *   !proto.stellar.GetBalanceResponse>}
 */
const methodDescriptor_StellarGRPC_GetBalance = new grpc.web.MethodDescriptor(
  '/stellar.StellarGRPC/GetBalance',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.stellar.GetBalanceRequest,
  proto.stellar.GetBalanceResponse,
  /** @param {!proto.stellar.GetBalanceRequest} request */
  function(request) {
    return request.serializeBinary()
  },
  proto.stellar.GetBalanceResponse.deserializeBinary,
)

/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.stellar.GetBalanceRequest,
 *   !proto.stellar.GetBalanceResponse>}
 */
const methodInfo_StellarGRPC_GetBalance = new grpc.web.AbstractClientBase.MethodInfo(
  proto.stellar.GetBalanceResponse,
  /** @param {!proto.stellar.GetBalanceRequest} request */
  function(request) {
    return request.serializeBinary()
  },
  proto.stellar.GetBalanceResponse.deserializeBinary,
)

/**
 * @param {!proto.stellar.GetBalanceRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.stellar.GetBalanceResponse>}
 *     The XHR Node Readable Stream
 */
proto.stellar.StellarGRPCClient.prototype.getBalance = function(
  request,
  metadata,
) {
  return this.client_.serverStreaming(
    this.hostname_ + '/stellar.StellarGRPC/GetBalance',
    request,
    metadata || {},
    methodDescriptor_StellarGRPC_GetBalance,
  )
}

/**
 * @param {!proto.stellar.GetBalanceRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.stellar.GetBalanceResponse>}
 *     The XHR Node Readable Stream
 */
proto.stellar.StellarGRPCPromiseClient.prototype.getBalance = function(
  request,
  metadata,
) {
  return this.client_.serverStreaming(
    this.hostname_ + '/stellar.StellarGRPC/GetBalance',
    request,
    metadata || {},
    methodDescriptor_StellarGRPC_GetBalance,
  )
}

/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.stellar.GetTrustlinesRequest,
 *   !proto.stellar.GetTrustlinesResponse>}
 */
const methodDescriptor_StellarGRPC_GetTrustlines = new grpc.web.MethodDescriptor(
  '/stellar.StellarGRPC/GetTrustlines',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.stellar.GetTrustlinesRequest,
  proto.stellar.GetTrustlinesResponse,
  /** @param {!proto.stellar.GetTrustlinesRequest} request */
  function(request) {
    return request.serializeBinary()
  },
  proto.stellar.GetTrustlinesResponse.deserializeBinary,
)

/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.stellar.GetTrustlinesRequest,
 *   !proto.stellar.GetTrustlinesResponse>}
 */
const methodInfo_StellarGRPC_GetTrustlines = new grpc.web.AbstractClientBase.MethodInfo(
  proto.stellar.GetTrustlinesResponse,
  /** @param {!proto.stellar.GetTrustlinesRequest} request */
  function(request) {
    return request.serializeBinary()
  },
  proto.stellar.GetTrustlinesResponse.deserializeBinary,
)

/**
 * @param {!proto.stellar.GetTrustlinesRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.stellar.GetTrustlinesResponse>}
 *     The XHR Node Readable Stream
 */
proto.stellar.StellarGRPCClient.prototype.getTrustlines = function(
  request,
  metadata,
) {
  return this.client_.serverStreaming(
    this.hostname_ + '/stellar.StellarGRPC/GetTrustlines',
    request,
    metadata || {},
    methodDescriptor_StellarGRPC_GetTrustlines,
  )
}

/**
 * @param {!proto.stellar.GetTrustlinesRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.stellar.GetTrustlinesResponse>}
 *     The XHR Node Readable Stream
 */
proto.stellar.StellarGRPCPromiseClient.prototype.getTrustlines = function(
  request,
  metadata,
) {
  return this.client_.serverStreaming(
    this.hostname_ + '/stellar.StellarGRPC/GetTrustlines',
    request,
    metadata || {},
    methodDescriptor_StellarGRPC_GetTrustlines,
  )
}

module.exports = proto.stellar
