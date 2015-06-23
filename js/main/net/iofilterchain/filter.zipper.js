/**
 * Created by Administrator on 2015/5/28.
 */
//dependencies
var filter = require('./filter');
var compressor = require('../crypto/factory').createCompressor('gzip');

//core module to export
module.exports = filter.create({
  /**
   * decompress the data.
   * @param value
   * @param options {Object}
   * @returns {*|utf8}
   */
  'processReadable': function(value, options){
    if(options.needDecompress){
      return compressor.decompress(value);
    }
    if(CryptoJS.lib.WordArray.isPrototypeOf(value)){
      return CryptoJS.enc.Utf8.stringify(value);
    }
    return "" + value;
  }
});