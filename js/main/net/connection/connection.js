/**
 * Created by Administrator on 2015/6/3.
 */
define(function(require, exports, module){

  //dependencies
  var eventemitter = require('../../utils/eventEmitter');
  var _ = require('lodash');
  var q = require('q');
  var State = require('./connectionstate');

  console.log('eventEmitter: ', eventemitter);

  //core module to export
  module.exports = eventemitter.extend({
    /**
     *
     * @param packet {protocolpacket}
     * @returns {Q.Promise}
     */
    'request': function(packet){
      return q(packet);
    },

    'getState': function(){
      return State.INITIALIZING;
    },

    'isAuthorized': function(){
      return false;
    },

    'getConfig': function(){
      return {};
    },

    'getDefaultConfig': function(){
      return {};
    },

    /**
     *
     * @param cfg {Object}
     * @return {exports}
     */
    'config': function(cfg){
      if(this.getConfig() && cfg){
        _.assign(this.getConfig(), cfg, function(value1, value2, key, obj){
          return _.isUndefined(obj[key]) ? value1 : value2;
        });
      }
      return this;
    },
    /**
     *
     * @param omitconfig {Array}
     * @returns {exports}
     */
    'resetConfig': function(omitconfig){
      omitconfig = omitconfig || ["connectionType", "encryptKey"];
      if(this.getConfig() && this.getDefaultConfig() && omitconfig){
        _.assign(this.getConfig(), _.omit(this.getDefaultConfig(), omitconfig));
      }
      return this;
    },
    /**
     *
     * @returns {exports}
     */
    'disableConfig': function(){
      if(this.getConfig()){
        _.assign(this.getConfig(), {
          'needEncrypt': false,
          'needDecrypt': false,
          'needCompress': false,
          'needDecompress': false,
          'needEncode': false,
          'needDecode': false
        });
      }
      return this;
    }
  }, ['config', 'resetConfig', 'disableConfig']);


});