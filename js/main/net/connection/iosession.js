/**
 * Created by Administrator on 2015/5/29.
 */
define(function(require, exports, module){

  //dependencies
  var chain = require('../iofilterchain/chain');
  var protocolpacket = require('../protocolpacket/protocolpacket');
  var origin = require('../base/origin');
  var q = require('q');

  //core module to export
  module.exports =  origin.extend({
    /**
     * read data from the connection and then process it with filter chain.
     * @param msg {protocolpacket}
     * @param options {Object}
     * @returns {Q.Promise}
     */
    'read': function(msg, options){
      return chain.filterRead(msg, options)
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
     * @param msg {protocolpacket}
     * @param options {Object}
     * @returns {Q.Promise}
     */
    'write': function(msg, options){
      console.group("iosession");
      return chain.filterWrite(msg, options)
        .catch(function(err){
          console.error(err);
        })
      ;
    }
  });

});