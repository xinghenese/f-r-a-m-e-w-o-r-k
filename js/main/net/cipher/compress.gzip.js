/**
 * Created by Administrator on 2015/5/25.
 *
 * a gzip implementation of compressor
 */
define(function(require, exports, module){

  //dependencies
  var compressor = require('./compress');
  var bytes = require('./bytes');
  var gzipjs = require('gzip-js');
  var core = require('core');
  var processible = require('./processible');

  var hex = CryptoJS.enc.Hex;
  var utf8 = CryptoJS.enc.Utf8;
  var WordArray = CryptoJS.lib.WordArray;

  //private fields
  var defaultOptions = {
    level: 6
  };

  //core module to export
  module.exports = compressor.create({
    /**
     * compress the text into a hex string.
     * @param text {string}
     * @param options
     * @returns {hex}
     */
    compress: function(text, options){
      return processible.create(text)
        .process(gzipjs.zip, gzipjs, options)
        .process(function(value){
          return bytes.create(value).toWordArray();
        })
        .process(hex.stringify)
        .done()
      ;
    },
    /**
     * decompress the text into a utf8 string.
     * @param hexText {hex|WordArray}
     * @param options
     * @returns {utf8}
     */
    decompress: function(hexText, options){
      return processible.create(hexText)
        //check whether need parse the text into a WordArray Object
        .process(function(value){
          if(WordArray.isPrototypeOf(value)){
            return value;
          }
//          return hex.parse(value);
          return hex.parse(value.replace(/(0d)*/gm, ''));
        })
        //transfer the WordArray Object into a ByteArray one.
        .process(function(value){
          return bytes.create(value).bytes;
        })
        //gzip decompress.
        .process(gzipjs.unzip, gzipjs, options || defaultOptions)
        //transfer the Array Object back to a WordArray one.
        .process(function(value){
          return bytes.create(value).toWordArray();
        })
        //stringify the WordArray Object into a utf8 string.
        .process(utf8.stringify)
        .done()
      ;
    }
  });

});