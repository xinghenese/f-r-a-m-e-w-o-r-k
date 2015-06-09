/**
 * Created by Administrator on 2015/5/28.
 */
//dependencies
var filter = require('./filter');
var cipher = require('../crypto/factory').createCipher();
var bytes = require('../crypto/bytes');

//core module to export
module.exports = filter.create({
  /**
   * process the data read from the connection or last filter by encryption.
   * @param value
   * @param options {Object}
   * @returns {WordArray|String}
   */
  'processReadable': function(value, options){
    if(options.needDecrypt && options.encryptKey) {
      var decrypted = cipher.decrypt(value, options.encryptKey);
      console.log('decrypted: ', CryptoJS.enc.Hex.stringify(decrypted));
      return decrypted;
    }
    return value;
//      return CryptoJS.enc.Hex.parse('1f8b0800b7c26a550003ab562a52b2' +
//        'd235ac0500f16d3b7608000000');
  },
  /**
   * process the data by decryption and then write to the connection
   * or next filter.
   * @param value
   * @param options {Object}
   * @returns {*}
   */
  'processWritable': function(value, options){
    console.log('encrypt-opts: ', options);
    console.log('cipher: ', cipher);
    if(options.needEncrypt && options.encryptKey){
//        return crypto.encrypt(value, options.encryptKey);
      return cipher.encrypt(value, options.encryptKey);
    }
    return value;
  }
});