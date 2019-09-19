/**
 * @fileoverview gRPC-Web generated client stub for evrynet
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');


var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js')

var proto_common_pb = require('../proto/common_pb.js')
const proto = {};
proto.evrynet = require('./evrynet_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.evrynet.EvrynetGRPCClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.evrynet.EvrynetGRPCPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.evrynet.GetNonceRequest,
 *   !proto.evrynet.GetNonceResponse>}
 */
const methodDescriptor_EvrynetGRPC_GetNonce = new grpc.web.MethodDescriptor(
  '/evrynet.EvrynetGRPC/GetNonce',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.evrynet.GetNonceRequest,
  proto.evrynet.GetNonceResponse,
  /** @param {!proto.evrynet.GetNonceRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.evrynet.GetNonceResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.evrynet.GetNonceRequest,
 *   !proto.evrynet.GetNonceResponse>}
 */
const methodInfo_EvrynetGRPC_GetNonce = new grpc.web.AbstractClientBase.MethodInfo(
  proto.evrynet.GetNonceResponse,
  /** @param {!proto.evrynet.GetNonceRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.evrynet.GetNonceResponse.deserializeBinary
);


/**
 * @param {!proto.evrynet.GetNonceRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.evrynet.GetNonceResponse>}
 *     The XHR Node Readable Stream
 */
proto.evrynet.EvrynetGRPCClient.prototype.getNonce =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/evrynet.EvrynetGRPC/GetNonce',
      request,
      metadata || {},
      methodDescriptor_EvrynetGRPC_GetNonce);
};


/**
 * @param {!proto.evrynet.GetNonceRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.evrynet.GetNonceResponse>}
 *     The XHR Node Readable Stream
 */
proto.evrynet.EvrynetGRPCPromiseClient.prototype.getNonce =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/evrynet.EvrynetGRPC/GetNonce',
      request,
      metadata || {},
      methodDescriptor_EvrynetGRPC_GetNonce);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.google.protobuf.Empty,
 *   !proto.evrynet.GetWhitelistAssetsResponse>}
 */
const methodDescriptor_EvrynetGRPC_GetWhitelistAssets = new grpc.web.MethodDescriptor(
  '/evrynet.EvrynetGRPC/GetWhitelistAssets',
  grpc.web.MethodType.SERVER_STREAMING,
  google_protobuf_empty_pb.Empty,
  proto.evrynet.GetWhitelistAssetsResponse,
  /** @param {!proto.google.protobuf.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.evrynet.GetWhitelistAssetsResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.google.protobuf.Empty,
 *   !proto.evrynet.GetWhitelistAssetsResponse>}
 */
const methodInfo_EvrynetGRPC_GetWhitelistAssets = new grpc.web.AbstractClientBase.MethodInfo(
  proto.evrynet.GetWhitelistAssetsResponse,
  /** @param {!proto.google.protobuf.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.evrynet.GetWhitelistAssetsResponse.deserializeBinary
);


/**
 * @param {!proto.google.protobuf.Empty} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.evrynet.GetWhitelistAssetsResponse>}
 *     The XHR Node Readable Stream
 */
proto.evrynet.EvrynetGRPCClient.prototype.getWhitelistAssets =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/evrynet.EvrynetGRPC/GetWhitelistAssets',
      request,
      metadata || {},
      methodDescriptor_EvrynetGRPC_GetWhitelistAssets);
};


/**
 * @param {!proto.google.protobuf.Empty} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.evrynet.GetWhitelistAssetsResponse>}
 *     The XHR Node Readable Stream
 */
proto.evrynet.EvrynetGRPCPromiseClient.prototype.getWhitelistAssets =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/evrynet.EvrynetGRPC/GetWhitelistAssets',
      request,
      metadata || {},
      methodDescriptor_EvrynetGRPC_GetWhitelistAssets);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.evrynet.GetBalanceRequest,
 *   !proto.evrynet.GetBalanceResponse>}
 */
const methodDescriptor_EvrynetGRPC_GetBalance = new grpc.web.MethodDescriptor(
  '/evrynet.EvrynetGRPC/GetBalance',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.evrynet.GetBalanceRequest,
  proto.evrynet.GetBalanceResponse,
  /** @param {!proto.evrynet.GetBalanceRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.evrynet.GetBalanceResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.evrynet.GetBalanceRequest,
 *   !proto.evrynet.GetBalanceResponse>}
 */
const methodInfo_EvrynetGRPC_GetBalance = new grpc.web.AbstractClientBase.MethodInfo(
  proto.evrynet.GetBalanceResponse,
  /** @param {!proto.evrynet.GetBalanceRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.evrynet.GetBalanceResponse.deserializeBinary
);


/**
 * @param {!proto.evrynet.GetBalanceRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.evrynet.GetBalanceResponse>}
 *     The XHR Node Readable Stream
 */
proto.evrynet.EvrynetGRPCClient.prototype.getBalance =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/evrynet.EvrynetGRPC/GetBalance',
      request,
      metadata || {},
      methodDescriptor_EvrynetGRPC_GetBalance);
};


/**
 * @param {!proto.evrynet.GetBalanceRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.evrynet.GetBalanceResponse>}
 *     The XHR Node Readable Stream
 */
proto.evrynet.EvrynetGRPCPromiseClient.prototype.getBalance =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/evrynet.EvrynetGRPC/GetBalance',
      request,
      metadata || {},
      methodDescriptor_EvrynetGRPC_GetBalance);
};


module.exports = proto.evrynet;

