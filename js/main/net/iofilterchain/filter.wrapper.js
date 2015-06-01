/**
 * Created by Administrator on 2015/5/28.
 */
define(function(require, exports, module){

  //dependencies
  var filter = require('./filter');
  var _ = require('lodash');
  var userconfigs = require('../userconfig/userconfig');

  //core module to export
  module.exports = filter.create({
    'processWritable': function(value){
      if(!value){
        throw new Error('empty data before wrapping');
      }
      return queryStringify(value);
    },
    'processReadable': function(value){
      return value.replace(/[\r\n]/gm, '');
    }
  });

  //private functions.
  function queryStringify(msg){
    return 'data=' + msg + "&" +
      "ver=" + userconfigs.getVersion() + "&" +
      "uuid=" + userconfigs.getUuid();
  }

});