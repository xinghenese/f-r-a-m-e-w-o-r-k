/**
 * Created by Administrator on 2015/5/29.
 */
define(function(require, exports, module){

  //dependencies
  var chain = require('../iofilterchain/chain');
  var origin = require('../base/origin');
  var q = require('q');

  //core module to export
  module.exports =  origin.extend({
    /**
     * read data from the connection and then process it with filter chain.
     * @param msg {Object|protocolpacket}
     * @returns {Q.Promise}
     */
    'read': function(msg){
      return chain.filterRead(msg)
        .then(function(value){
          console.groupEnd();
          return value;
        })
        .catch(function(err){
          console.error(err);
        })
      ;
    },
    /**
     * write data processed with filter chain to the connection.
     * @param msg {Object|protocolpacket}
     * @returns {Q.Promise}
     */
    'write': function(msg){
      console.group("iosession");
      return chain.filterWrite(msg)
        .catch(function(err){
          console.error(err);
        })
      ;
    },
    /**
     * @param cfg {Object}
     * @returns {exports}
     */
    'config': function(cfg){
      chain.config(cfg);
      return this;
    }
  });

});