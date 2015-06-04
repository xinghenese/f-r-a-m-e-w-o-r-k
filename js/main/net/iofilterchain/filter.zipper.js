/**
 * Created by Administrator on 2015/5/28.
 */
define(function(require, exports, module){

  //dependencies
  var filter = require('./filter');
  var compressor = require('../cipher/factory').createCompressor('gzip');

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
        console.log('compress: ', value);
        return compressor.decompress(value);
      }
      return value;
    }
  });

});