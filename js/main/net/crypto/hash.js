/**
 * Created by Administrator on 2015/5/25.
 *
 * adapter of hash
 * final props: [hash]
 * adapted props: [hashEncode, hashDecode]
 */

//dependencies
var origin = require('./../base/origin');

//module to export
module.exports = origin.extend({
  /**
   * encode the text with hashkey
   * @param rawText {String}
   * @param hashKey {String}
   * @returns {String}
   */
  hashEncode: function(rawText, hashKey){
    return rawText;
  },
  /**
   * decode the text with hashkey
   * @param hashText {String}
   * @param hashKey {String}
   * @returns {String}
   */
  hashDecode: function(hashText, hashKey){
    return hashText;
  },
  /**
   * encode the text with hashkey
   * @param rawText {String}
   * @param hashKey {String}
   * @returns {String}
   */
  hash: function(rawText, hashKey){
    return this.hashEncode(rawText, hashKey);
  }
}, ['hash']);