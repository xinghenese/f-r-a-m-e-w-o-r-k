/**
 * Created by Administrator on 2015/5/25.
 *
 * a base64 implementation of codec.
 */

//dependencies
var CryptoJS = require('./core');
var codec = require('./codec');

var utf8 = CryptoJS.enc.Utf8;
var hex = CryptoJS.enc.Hex;
var WordArray = CryptoJS.lib.WordArray;
var base64 = CryptoJS.enc.Base64;

//core module to export
module.exports = codec.create({
  encodeHex: function(hexText){
    if(!WordArray.isPrototypeOf(hexText)){
      hexText = hex.parse(hexText.replace(/[\r\n]/gm, ''));
    }
    return base64.stringify(hexText);
  },
  decodeToHex: function(encodedText){
    return hex.stringify(base64.parse(encodedText));
  },
  encode: function(utf8Text){
    if(!WordArray.isPrototypeOf(utf8Text)){
      utf8Text = utf8.parse(utf8Text);
    }
    return base64.stringify(utf8Text);
  },
  decode: function(encodedText){
    return utf8.stringify(base64.parse(encodedText));
  }
});