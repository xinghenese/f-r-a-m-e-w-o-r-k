/**
 * Created by Administrator on 2015/6/2.
 */

//dependencies
var _ = require('lodash');
var promise = require('../../utils/promise');
var State = require('./connectionstate');
var connection = require('./connection');
var iosession = require('./iosession');
var socket = require('./socket');
var keyExchange = require('../crypto/factory').createKeyExchange();
var session = require('./socketsession');
var repeat = require('../../utils/repeat');

console.log('iosession: ', iosession);
console.log('socketsession: ', session);

//private const fields
var PUBLIC_KEY_FIELD = "pbk";
var HANDSHAKE_TAG = "HSK";
var SOCKET_HOSTS = [];
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
  'connectionType': "socket"
};

//private fields.
var authorizePromise = null;
var state = State.INITIALIZING;
var isAuthorized = false;

//core module to export
var socketconnection = module.exports = connection.extend({
  /**
   *
   * @param packet {Object|String}
   * @returns {Q.Promise}
   */
  'request': function(packet){
    packet = packetFormalize(packet);

    if(!(packet.data || HANDSHAKE_TAG == packet.tag)){
      return authorize().repeat(function(){
        return get(packet.tag);
      });
    }
    return authorize().then(function(value){
      console.log('authorize.then: ', value);
      //avoid duplicate authorization request.
      if(HANDSHAKE_TAG == packet.tag){
        return value;
      }
      if(packet.data){
        return post(packet);
      }
    });
  },

  'getState': function(){
    return state;
  },

  'isAuthorized': function(){
    return isAuthorized;
  }
});

//initialize
socketconnection.on('ready', function(){
  state = State.CONNECTING;
});
socketconnection.on('connect', function(){
  state = State.CONNECTED;
  socketconnection.on('message', onMessageReceived);
});
state = State.INITIALIZED;

//private functions
//just listen to data reception with tag.
function get(tag){
  return socketconnection.on(tag);
}

function post(packet){
  var tag = packet.tag;
  var data = packet.data;

  if(session.has(tag)){
    return promise.create(session.fetch(tag));
  }

  var pro = socketconnection.once(tag);

  //process and write data to session and then send via socket.
  session.write(_.set({}, tag, data), _.assign({}, DEFAULT_CONFIG))
    .then(function(value){
      return socket.send(value);
    });

  console.log('socketconnection: ', socketconnection);
  console.log('post(tag): ', tag);
  console.log('socketconnection.once(tag): ', pro);
  console.log('promise.isPrototypeOf(socketconnection.once(tag)): ', promise.isPrototypeOf(pro));
  console.log('listeners: ', socketconnection.listeners(tag));
//  return socketconnection.once(tag);
  return pro;
}

function packetFormalize(packet){
  var tag;
  var data;

  if(!packet || _.isEmpty(packet)){
    throw new Error("empty packet to be sent via socket");
  }
  if(_.isPlainObject(packet)){
    tag = "" + (packet.tag || _.keys(packet)[0]);
    data = packet.data || _.get(packet, tag);

    if(!tag){
      throw new Error('invalid tag');
    }
    if(data && !_.isEmpty(data)){
      return {
        'tag': tag,
        'data': data
      }
    }
  }
  return {
    'tag': "" + packet,
    'data': null
  }
}

function onMessageReceived(msg){
  return session.read(msg, _.assign({}, DEFAULT_CONFIG))
    .then(function(value){
      var tag = value.tag;
      var data = value.data;

      console.dir(value);
      console.log('tag: ', tag);
      console.log('data: ', data);

      //check whether the message is pushed by server or pulled from server.
      console.log('listeners: ', socketconnection.listeners(tag));
      if(tag && !_.isEmpty(socketconnection.listeners(tag))){
        console.log('socketconnection#emit: ', value);
        socketconnection.emit(tag, data);
      }else{
        //if the message pushed by server does not have to notify immediately,
        //then cache it into the session for later use.
        if(shouldNotify(tag)){
          notifyImmediately(tag, data);
        }else{
          session.cache(tag, data);
        }
      }
    })
  ;
}

function authorize(){
  if(!authorizePromise){
    authorizePromise = post({
        'tag': "HSK",
        'data': _.set({}, PUBLIC_KEY_FIELD, keyExchange.getPublicKey())
      })
      .then(function(value){
        var key = keyExchange.getEncryptKey(_.get(value, PUBLIC_KEY_FIELD));
        _.set(DEFAULT_CONFIG, 'encryptKey', key);
        isAuthorized = true;
        return value;
      }, function(reason){
        console.log('error: ', reason);
      })
    ;
  }

  return authorizePromise;
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