/**
 * Created by Administrator on 2015/5/28.
 *
 * adapter of cipher
 * adapted props: [encrypt, decrypt]
 */

//dependencies
var origin = require('../base/origin.js');

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