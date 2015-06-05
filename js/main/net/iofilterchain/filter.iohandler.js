/**
 * Created by Administrator on 2015/5/29.
 */
define(function(require, exports, module){

  //dependencies
  var filter = require('./filter');
  var processible = require('../cipher/processible');
  var factory = require('../cipher/factory');
  var keyExchange = factory.createKeyExchange();
  var codec = factory.createCodec();
  var _ = require('lodash');
  var protocolpacket = require('../protocolpacket/protocolpacket');
  var connectionProto = require('../connection/connection');

  //private const fields
  var PUBLICK_KEY_FIELD = 'pk';

  //core module to export
  module.exports = filter.create({
    'processReadable': function(msg, options){
      var connection = getConnection(options.connectionType);
      var result;
      var data;
      var tag;

      if(!msg){
        throw new Error('empty response');
      }
      if(!protocolpacket.isPrototypeOf(msg)){
        throw new Error('processed message in non-protocolpacket format');
      }
      result = msg.result;
      data = msg.data;
      tag = msg.tag;

      //should extend the logic here to handle various invalid results.
      if(result != 0){
        throw new Error('invalid result');
      }
      //in case of something wrong with response data.
      if(!data){
        throw new Error('empty data');
      }
      //check whether is a handshake/authentication response and handle it.
      if(PUBLICK_KEY_FIELD in data){
//        isAuthorized = true;
        handleHandShakeResponse(data[PUBLICK_KEY_FIELD ], connection);
        console.log('opts: ', options);
      }
      notify(msg);
      return msg;
    },
    /**
     *
     * @param msg {protocolpacket}
     * @param options
     * @returns {*}
     */
    'processWritable': function(msg, options){
      var connectionType = options.connectionType;
      var connection = getConnection(connectionType);
      var data = msg;

      console.log('iohandler-write.msg: ', msg);

      if(protocolpacket.isPrototypeOf(msg)){
        data = msg.data;
      }
      //if neither authorized nor authorizing, hold on the request until authorized
      if(!connection.isAuthorized() && !(PUBLICK_KEY_FIELD in msg.data)){
        console.log('not Authorized');
        return handleHandShakeRequest(connection, msg);
      }
      //else start the request directly.
      return msg;
    }
  });

  //private functions

  function handleHandShakeRequest(connection, packet){
    if(!connectionProto.isPrototypeOf(connection)){
      throw new Error('invalid connection');
    }
    if(protocolpacket.isPrototypeOf(packet)){
      connection.once('authorize', function(){
        console.log('authorize');
        connection.request(packet);
      });
    }
    return connection
      .disableConfig()
      .request(protocolpacket.create({
        'url': "auth/c",
        'tag': "HSK",
        'data': _.set({}, PUBLICK_KEY_FIELD, keyExchange.getPublicKey())
      }))
    ;

//    console.log('connection: ', connection.getConfig());
//
//    return this.processWritable(protocolpacket.create({
//      'url': "auth/c",
//      'tag': "HSK",
//      'data': _.set({}, PUBLICK_KEY_FIELD, keyExchange.getPublicKey())
//    }), connection.getConfig());
  }

  function handleHandShakeResponse(key, connection){
    //store the encryptKey if successful response of handshake.
    connection
      .resetConfig()
      .config({
        'encryptKey': keyExchange.getEncryptKey(key)
      })
      .emit('authorize')
    ;
    return connection;
  }

  function getConnection(tag){
    var connection;

    switch(tag){
      case 'http':
        connection = require('../connection/httpconnection');
        break;
      case 'socket':
        connection = require('../connection/socketconnection');
        break;
      default:
        connection = null;
    }
    if(!connection){
      throw new Error('connection module not initialized yet');
    }

    return connection;
  }

  function notify(msg){
    console.log('notify with ', msg);
  }

});