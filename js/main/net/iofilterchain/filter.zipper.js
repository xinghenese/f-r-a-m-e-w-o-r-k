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
     * @returns {*|utf8}
     */
    'processReadable': function(value){
      return compressor.decompress(value);
    },
    /**
     * config the filter to specify whether to compress or decompress
     * the data.
     * @param cfg
     */
    'notifyConfig': function(cfg){
      if(!_.isUndefined(cfg.needCompress)){
        this.enableWrite = !!cfg.needCompress;
      }
      if(!_.isUndefined(cfg.needDecompress)){
        this.enableRead = !!cfg.needDecompress;
      }
    }
  });

});