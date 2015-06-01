/**
 * Created by Administrator on 2015/5/30.
 *
 * an AES implementation of crypto
 */
define(function(require, exports, module){

  //dependencies
  var crypto = require('./crypto');
  var aes = require('aes');

  //core module to export
  module.exports = crypto.create({
    'encrypt': function(text, key){
      return aes.encrypt(text, key, {mode:CryptoJS.mode.ECB,padding:CryptoJS.pad.Pkcs7});
    },
    'decrypt': function(text, key){
      return aes.decrypt(text, key, {mode:CryptoJS.mode.ECB,padding:CryptoJS.pad.Pkcs7});
    }
  });

});