/**
 * Created by Administrator on 2015/5/28.
 *
 * adapter of crypto
 * adapted props: [encrypt, decrypt]
 */
define(function(require, exports, module){

  //dependencies
  var origin = require('../base/origin');

  //core module to export
  module.exports = origin.extend({
    /**
     * encrypt the text with key.
     * @param text
     * @param key
     * @returns {WordArray}
     */
    encrypt: function(text, key){
      return text;
    },
    /**
     * decrypt the text with key.
     * @param text
     * @param key
     * @returns {WordArray}
     */
    decrypt: function(text, key){
      return text;
    }
  });

});