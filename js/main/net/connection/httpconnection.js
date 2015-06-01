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

  //private const fields
  var DEFAULT_CONFIG = {
    'needEncrypt': true,
    'needDecrypt': true,
    'needCompress': false,
    'needDecompress': true,
    'needEncode': false,
    'needDecode': true,
    'urlRoot': "",
    'encryptKey': ""
  };

  //private fields.
  var tempConfig = _.assign({}, DEFAULT_CONFIG);

  //core module to export
  module.exports = origin.extend({
    /**
     * unify the HTTP request interface by means of HTTP GET or HTTP POST
     * @param arg1
     * @param arg2
     * @returns {Q.Promise}
     */
    'request': function(arg1, arg2){
      var url;
      var data;
      var root;

      //if arg1 is a subtype of protocolpacket, then parse it into
      //three components: root, url and data.
      if(protocolpacket.isPrototypeOf(arg1)){
        url = '' + arg1.url;
        data = arg1.data;
        root = '' + arg1.root;
      }else{
        url = '' + arg1;
        data = _.toPlainObject(arg2);
      }

      http.config({
        'urlRoot': root
      });
      if(data && !_.isEmpty(data)){
        return this.post(url, data);
      }
      return this.get(url);
    },
    /**
     * HTTP POST
     * @param url
     * @param data
     * @returns {Q.Promise}
     */
    'post': function(url, data){
      return session.write(data)
        .then(function(value){
          return http.post(url, value);
        })
        .then(function(value){
          return session.read(value);
        })
      ;
    },
    /**
     * HTTP GET
     * @param url
     * @returns {Q.Promise}
     */
    'get': function(url){
      return http.get(url)
        .then(function(value){
          return session.read(value);
        })
      ;
    },
    'config': function(cfg){
      console.log('connection.cfg: ', cfg);
      if(cfg){
        cfg = tempConfig = _.mapValues(tempConfig, function(value, key){
          return _.isUndefined(cfg[key]) ? value : cfg[key];
        });
        console.log('cfg: ', cfg);
        http.config(cfg);
        session.config(cfg);
      }
      return this;
    },
    'resetConfig': function(){
      tempConfig = _.assign({}, DEFAULT_CONFIG);
      session.config(tempConfig);
      return this;
    },
    'disableConfig': function(){
      tempConfig = {
        'needEncrypt': false,
        'needDecrypt': false,
        'needCompress': false,
        'needDecompress': false,
        'needEncode': false,
        'needDecode': false
      };
      session.config(tempConfig);
      return this;
    }
  });

});