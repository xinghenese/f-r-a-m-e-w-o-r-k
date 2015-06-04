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
    /**
     * parse the value into a plain object
     * @param value {String}
     * @param options {Object}
     * @returns {Object}
     */
    'processReadable': function(value, options){
      console.log(value);
//      return JSON.parse(value);
      return JSON.parse(('' + value).replace(/^[^{]*?\{/, '{').replace(/[\r\n]/gm, ''));
    },
    /**
     * transfer the value into a string
     * @param value {Object}
     * @param options {Object}
     * @returns {String}
     */
    'processWritable': function(value, options){
      return JSON.stringify(value);
//      return JSON.stringify(_.omit(value, userconfigs.configs()));
    }
  });

});