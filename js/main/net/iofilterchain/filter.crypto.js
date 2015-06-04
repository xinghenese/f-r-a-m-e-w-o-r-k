/**
 * Created by Administrator on 2015/5/28.
 */
define(function(require, exports, module){

  //dependencies
  var filter = require('./filter');
  var crypto = require('../cipher/factory').createCrypto();
  var bytes = require('../cipher/bytes');

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
        return crypto.decrypt(value, options.encryptKey);
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
      if(options.needEncrypt && options.encryptKey){
//        return crypto.encrypt(value, options.encryptKey);
        var k = crypto.encrypt(value, options.encryptKey);
        console.log('k: ', k);
        return k;
      }
      return value;
    }
  });

});