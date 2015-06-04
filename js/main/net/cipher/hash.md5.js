/**
 * Created by Administrator on 2015/5/25.
 *
 * an MD5 implementation of hash
 */
define(function(require, exports, module){

  //dependencies
  var hash = require('./hash');
  var core = require('core');
  var md5 = require('md5');

  //core module to export
  module.exports = hash.create({
    hashEncode: function(msg){
      return CryptoJS.MD5(msg).toString();
    }
  })

});