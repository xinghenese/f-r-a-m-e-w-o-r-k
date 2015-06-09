/**
 * Created by Administrator on 2015/5/25.
 *
 * adapter of compressor
 * adapted props: [compress, decompress]
 */

//dependencies
var origin = require('./../base/origin');

//core module to export
module.exports = origin.extend({
  compress: function(text, options){
    return text;
  },
  decompress: function(hexText, options){
    return hexText;
  }
});