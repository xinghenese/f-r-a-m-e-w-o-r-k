/**
 * Created by Administrator on 2015/5/28.
 */
define(function(require, exports, module){

  //dependencies
  var filter = require('./filter');
  var crypto = require('../cipher/factory').createCrypto();
  var bytes = require('../cipher/bytes');

  //private fields
  var encryptKey = '';

  //core module to export
  module.exports = filter.create({
    /**
     * process the data read from the connection or last filter by encryption.
     * @param value
     * @returns {WordArray|String}
     */
    'processReadable': function(value){
      if(encryptKey) {
        value = crypto.decrypt(value, encryptKey);
        console.log('valueToHex: ', bytes.create(value).toHex());
      }
      console.log('encrypt_key:', encryptKey);
      console.log('value: ', value);
      return value;
//      return CryptoJS.enc.Hex.parse('1f8b0800b7c26a550003ab562a52b2' +
//        'd235ac0500f16d3b7608000000');
    },
    /**
     * process the data by decryption and then write to the connection
     * or next filter.
     * @param value
     * @returns {*}
     */
    'processWritable': function(value){
      if(encryptKey){
        return crypto.encrypt(value, encryptKey);
      }
      return value;
    },
    /**
     * config the filter to specify the encryptKey and whether to encrypt
     * or decrypt data
     * @param cfg
     */
    'notifyConfig': function(cfg){
      console.log('filter.crypto.cfg: ', cfg);
      if(!_.isUndefined(cfg.needEncrypt)){
        this.enableWrite = !!cfg.needEncrypt;
      }
      if(!_.isUndefined(cfg.needDecrypt)){
        this.enableRead = !!cfg.needDecrypt;
      }
      if(!encryptKey && !_.isUndefined(cfg.encryptKey)){
        encryptKey = cfg.encryptKey;
      }
    }
  });

});