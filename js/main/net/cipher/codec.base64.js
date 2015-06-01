/**
 * Created by Administrator on 2015/5/25.
 *
 * a base64 implementation of codec.
 */
define(function(require, exports, module){

  //dependencies
  var codec = require('./codec');
  var base64 = require('enc-base64');

  var utf8 = CryptoJS.enc.Utf8;
  var hex = CryptoJS.enc.Hex;

  //core module to export
  module.exports = codec.create({
    encodeHex: function(hexText){
      return base64.stringify(hex.parse(hexText));
    },
    decodeToHex: function(encodedText){
      return hex.stringify(base64.parse(encodedText));
    },
    encode: function(utf8Text){
      return base64.stringify(utf8.parse(utf8Text));
    },
    decode: function(encodedText){
      return utf8.stringify(base64.parse(encodedText));
    }
  });

});