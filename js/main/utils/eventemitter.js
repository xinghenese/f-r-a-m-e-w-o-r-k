/**
 * Created by Administrator on 2015/6/3.
 */
define(function(require, exports, module){

  //dependencies
  var EventEmitter = require('eventEmitter');
  var origin = require('../net/base/origin');

  //core module to export
  module.exports = origin.extend({}, [], EventEmitter);

});