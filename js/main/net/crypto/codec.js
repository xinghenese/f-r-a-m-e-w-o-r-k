/**
 * Created by Administrator on 2015/5/25.
 *
 * adapter of codec
 * adapted props: [encodeHex, decodeToHex, encode, decode]
 */

//dependencies
var origin = require('./../base/origin');

//core module to export
module.exports = origin.extend({

  encodeHex: function(hexText){
    return hexText;
  },
  decodeToHex: function(encodedText){
    return encodedText;
  },
  encode: function(utf8Text){
    return utf8Text;
  },
  decode: function(encodedText){
    return encodedText;
  }

});