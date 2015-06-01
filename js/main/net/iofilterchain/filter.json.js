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
     * @returns {Object}
     */
    'processReadable': function(value){
      console.log(value);
      return JSON.parse(value);
    },
    /**
     * transfer the value into a string
     * @param value {Object}
     * @returns {String}
     */
    'processWritable': function(value){
      return JSON.stringify(_.omit(value, userconfigs.configs()));
    }
  });

});