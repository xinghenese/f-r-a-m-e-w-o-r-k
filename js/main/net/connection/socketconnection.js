/**
 * Created by Administrator on 2015/6/2.
 */
define(function(require, exports, module){

  //dependencies
  var connection = require('./connection');
  var protocolpacket = require('../protocolpacket/protocolpacket');
  var _ = require('lodash');
  var q = require('q');
  var socket = require('./socket');
  var session = require('./socketsession');
  var State = require('./connectionstate');

  //private const fields
  var DEFAULT_CONFIG = {
    'needEncrypt': true,
    'needDecrypt': true,
    'needCompress': false,
    'needDecompress': false,
    'needEncode': false,
    'needDecode': false,
    'needWrap': false,
    'needUnwrap': true,
    'urlRoot': "",
    'encryptKey': "",
    'connectionType': "http"
  };

  //private fields.
  var tempConfig = _.assign({}, DEFAULT_CONFIG);
  var state = State.INITIALIZING;

  //core module to export
  var socketconnectoin = module.exports = connection.extend({
    'request': function(packet){
      var self = this;
      var tag = '';
      var data = {};

      if(protocolpacket.isPrototypeOf(packet)){
        tag = packet.tag;
        data = packet.data;
      }

      if(tag && !_.isEmpty(data)){
        return q.Promise(function(resolve, reject, progress){
          self.once(tag, function(msg){
            if(!msg){
              reject('empty message received via socket');
              return;
            }
            resolve(msg);
          });

          //process and write data to session and then send via socket.
          session.write(_.set({}, tag, data))
            .then(function(value){
              return socket.send(value);
            })
          ;
        });
      }else if(tag && session.has(tag)){
        return q(session.fetch(tag));
      }
    },

    'getState': function(){
      return state;
    },

    'isAuthorized': function(){
      return state == State.AUTHORIZED;
    },

    'getConfig': function(){
      return tempConfig;
    },
    'getDefaultConfig': function(){
      return DEFAULT_CONFIG;
    },

    'init': function(){
      var self = this;
      socket.on('ready', function(){
        state = State.CONNECTING;
      });
      self.on('connect', function(){
        state = State.CONNECTED;
        self.on('message', onMessageReceived);
      });
      state = State.INITIALIZED;
    }
  });

  //initialize
  socketconnectoin.on('ready', function(){
    state = State.CONNECTING;
  });
  socketconnectoin.on('connect', function(){
    state = State.CONNECTED;
    socketconnectoin.on('message', onMessageReceived);
  });
  state = State.INITIALIZED;

  //private functoins
  function onMessageReceived(msg){
    var self = this;
    if(state == State.CONNECTED){
      state = State.AUTHORIZING;
    }
    return session.read(msg)
      .then(function(value){
        var tag;
        var data;

        if(_.isEmpty(value)){
          throw new Error('empty data after filterd');
        }
        if(protocolpacket.isPrototypeOf(value)){
          tag = value.tag;
          data = value.data;

          //check whether the message is pushed by server or pulled from server.
          if(tag && !_.isEmpty(self.getListeners(tag))){
            self.emit(tag, value);
          }else{
            //if the message pushed by server does not have to notify immediately,
            //then cache it into the session for later use.
            if(shouldNotify(tag)){
              notifyImmediately(tag, data);
            }else{
              session.cache(tag, data);
            }
          }
        }
      })
    ;
  }

  function shouldNotify(tag){
    return Math.random() < 0.5;
  }

  function notifyImmediately(tag, data){
    console.log('notifyImmediately: ', JSON.stringify({
      'tag': tag,
      'data': data
    }))
  }

});