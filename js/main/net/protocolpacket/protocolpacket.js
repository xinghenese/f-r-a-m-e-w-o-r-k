/**
 * Created by Administrator on 2015/5/31.
 */
define(function(require, exports, module){

  //dependencies
  var origin = require('../base/origin');

  //core module to export
  module.exports = origin.extend({
    'root': '',
    'url': '',
    'data': {}
  });

});