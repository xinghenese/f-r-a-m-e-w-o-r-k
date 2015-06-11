/**
 * Created by Administrator on 2015/6/2.
 */

//dependencies
var _ = require('lodash');
var q = require('q');
var State = require('./connectionstate');
var connection = require('./connection');
var iosession = require('./iosession');
var socket = require('./socket');
var keyExchange = require('../crypto/factory').createKeyExchange();
var session = require('./socketiosession');
var repeat = require('../../utils/repeat');

console.log('iosession: ', iosession);

//private const fields
var PUBLIC_KEY_FIELD = "pk";
var HANDSHAKE_TAG = "HSK";
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
    return authorize().then(function(value){
      //avoid duplicate authorization request.
      if(!packet || (HANDSHAKE_TAG in packet) || (HANDSHAKE_TAG == packet.tag)){
        return value;
      }
      if(_.isPlainObject(packet)){
        return post(packet);
      }
      return get("" + packet);
    })
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
function get(tag){
  if(!tag){
    throw new Error('invalid tag');
  }
  return repeat.create(function(resolve, reject){
    socketconnection.on(tag, function(msg){
      if(!msg){
        reject('empty message received via socket');
        return;
      }
      resolve(msg);
    })
  });
}

function post(packet){
  var tag = '';
  var data = {};

  if(!packet || _.isEmpty(packet)){
    throw new Error("empty packet to be sent via socket");
  }

  tag = "" + (packet.tag || _.keys(packet)[0]);
  data = packet.data || _.get(packet, tag);

  if(!tag){
    throw new Error("invalid packet tag");
  }
  if(!data || _.isEmpty(data)){
    throw new Error("empty data in packet[" + tag + "]");
  }

  if(session.has(tag)){
    return q(session.fetch(tag));
  }
  return q.Promise(function(resolve, reject, progress){
    socketconnection.once(tag, function(msg){
      if(!msg){
        reject('empty message received via socket');
        return;
      }
      resolve(msg);
    });

    //process and write data to session and then send via socket.
    session.write(_.set({}, tag, data), _.assign({}, DEFAULT_CONFIG))
      .then(function(value){
        return socket.send(value);
      })
    ;
  });
}

function onMessageReceived(msg){
  return session.read(msg, _.assign({}, DEFAULT_CONFIG))
    .then(function(value){
      var tag = value.tag;
      var data = value.data;

      //check whether the message is pushed by server or pulled from server.
      if(tag && !_.isEmpty(socketconnection.getListeners(tag))){
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
        'data': {'pbk': keyExchange.getPublicKey()}
      })
      .then(function(value){
        var key = keyExchange.getEncryptKey(_.get(value, PUBLIC_KEY_FIELD));
        _.set(DEFAULT_CONFIG, 'encryptKey', key);
        isAuthorized = true;
        return value;
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