/**
 * Created by Administrator on 2015/5/29.
 */
define(function(require, exports, module){

  //dependencies
  var session = require('./iosession');
  var http = require('./http');
  var origin = require('../base/origin');
  var q = require('q');
  var _ = require('lodash');
  var protocolpacket = require('../protocolpacket/protocolpacket');
  var connection = require('./connection');
  var State = require('./connectionstate');

  //private const fields
  var DEFAULT_CONFIG = {
    'needEncrypt': true,
    'needDecrypt': true,
    'needCompress': false,
    'needDecompress': true,
    'needEncode': false,
    'needDecode': false,
    'needWrap': true,
    'needUnwrap': true,
    'urlRoot': "",
    'urlPath': "",
    'encryptKey': "",
    'connectionType': "http"
  };

  //private fields.
  var tempConfig = _.assign({}, DEFAULT_CONFIG);
  var state = State.INITIALIZING;
  var isAuthorized = false;

  //core module to export
  var httpconnection = module.exports = connection.extend({
    /**
     * unify the HTTP request interface by means of HTTP GET or HTTP POST
     * @param packet {protocolpacket}
     * @returns {Q.Promise}
     */
    'request': function(packet){
      var url;
      var data;
      var root;

      if(protocolpacket.isPrototypeOf(packet)){
        url = '' + packet.url;
        data = packet.data;
        root = '' + packet.root;
        console.log('protocolpacket');

        http.config({
          'urlRoot': root
        });

        console.log('request-temp-opts: ', tempConfig);
        if(data && !_.isEmpty(data)){
          return this.post(url, packet, tempConfig);
        }
        return this.get(url, tempConfig);
      }
    },
    /**
     * HTTP POST
     * @param url {String}
     * @param packet {Object|protocolpacket}
     * @returns {Q.Promise}
     */
    'post': function(url, packet){
      console.log('temp-opts: ', tempConfig);
//      options = options ? _.assign({}, tempConfig, options) : tempConfig;
      var options = _.set(tempConfig, 'urlPath', url);
//      options = _.assign({}, _.set(tempConfig, 'urlPath', url), options);
      console.log('post-opts: ', options);

      if(!protocolpacket.isPrototypeOf(packet)){
        packet = protocolpacket.create({
          'url': url,
          'data': packet
        });
      }

      return session.write(packet, options)
        .then(function(value){
          return http.post(tempConfig.urlPath, value);
        })
        .then(function(value){
          return session.read(value, options);
        })
      ;
    },
    /**
     * HTTP GET
     * @param url
     * @returns {Q.Promise}
     */
    'get': function(url){
//      options = options ? _.assign({}, tempConfig, options) : tempConfig;
      var options = _.set(tempConfig, 'urlPath', url);
//      options = _.assign({}, _.set(tempConfig, 'urlPath', url), options);
      return http.get(tempConfig.urlPath)
        .then(function(value){
          return session.read(value, options);
        })
      ;
    },

    'getState': function(){
      return state;
    },

    'isAuthorized': function(){
      return isAuthorized;
    },

    'getConfig': function(){
      return tempConfig;
    },
    'getDefaultConfig': function(){
      return DEFAULT_CONFIG;
    }

  });

  //initialize
  httpconnection.on('ready', function(){
    state = State.CONNECTING;
  });
  httpconnection.on('connect', function(){
    state = State.CONNECTED;
  });
  httpconnection.on('close', function(){
    state = State.INITIALIZED;
  });
  httpconnection.on('authorize', function(){
    state = State.AUTHORIZED;
    isAuthorized = true;
  });
  state = State.INITIALIZED;

  module.exports = httpconnection;

});