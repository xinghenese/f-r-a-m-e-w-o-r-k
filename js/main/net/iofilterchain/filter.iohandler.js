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

  //private const fields
  var PUBLICK_KEY_FIELD = 'pk';

  //private fields
  var isAuthorized = false;
  var delayedTask = null;

  //core module to export
  module.exports = filter.create({
    'processReadable': function(msg){
      if(!msg){
        throw new Error('empty response');
      }
      var result = + msg.r;
      var data = msg.data;

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
        isAuthorized = true;
        handleHandShakeResponse(data[PUBLICK_KEY_FIELD ]);
      }
      if(delayedTask && protocolpacket.isPrototypeOf(delayedTask)){
        //if some tasks have been delayed to await authentication,
        //start these request tasks once authorized. when these request
        //tasks being handled successfully, clear the delayedTasks.
        return getConnection()
          .request(delayedTask)
          .then(function(value){
            delayedTask = null;
            return value;
          })
        ;
      }
      notify(data);
      return data;
    },
    'processWritable': function(msg){
      //if neither authorized nor authorizing, hold on the request until authorized
      if(!isAuthorized && !(PUBLICK_KEY_FIELD in msg)){
        handleHandShakeRequest()
          .then(function(value){
            //cache the request in order to later start the request once authorized.
            registerDelayedTask(msg);
            return value;
          })
      }
      //else start the request directly.
      return msg;
    }
  });

  //private functions
  function handleHandShakeRequest(){
    return getConnection()
      .disableConfig()
      .request(protocolpacket.create({
        'url': "auth/c",
        'data': _.set({}, PUBLICK_KEY_FIELD, keyExchange.getPublicKey())
      }))
      ;
  }

  function handleHandShakeResponse(key){
    //store the encryptKey if successful response of handshake.
    return getConnection()
      .resetConfig()
      .config({
        'encryptKey': keyExchange.getEncryptKey(key)
      })
    ;
  }

  function registerDelayedTask(task){
    if(task && protocolpacket.isPrototypeOf(task)){
      delayedTask = task;
    }
  }

  function getConnection(){
    var connection = require('../connection/httpconnection');
    if(!connection){
      throw new Error('connection error');
    }
    return connection;
  }

  function notify(msg){
    console.log('notify with ', msg);
  }

});