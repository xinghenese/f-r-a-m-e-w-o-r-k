/**
 * Created by Administrator on 2015/5/25.
 *
 * adapter of keyExchange
 * final props: [getPublicKey, getEncryptedKey]
 * adapted props: [getLocalKey, getSharedKey]
 */
define(function(require, exports, module){

  //dependencies
  var origin = require('../base/origin');
  var codec = require('./codec.base64');
  var hash = require('./hash.md5');
  var processible = require('./processible');
  var bytes = require('./bytes');

  //core module to export
  module.exports = origin.extend({
    /**
     * generate the key locally.
     * @returns {String}
     *    local publicKey
     */
    getLocalKey: function(){
      return '';
    },
    /**
     * process the local-key by base64-encoding.
     * @returns {String}
     *    local publicKey
     */
    getPublicKey: function(){
      return processible.create(this.getLocalKey().toByteArray())
        .process(function(value){
          return bytes.create(value).toHex();
        })
        .process(codec.encodeHex, codec)
        .process(function(key){
          console.log('pbulKey: ', key);
          return key;
        })
        .done()
      ;
    },
    /**
     * generate the shared key with the publicKey fetched from the remote.
     * @param remotePub
     *    the publicKey fetched from the remote
     * @returns {*} BigInteger recommended
     */
    getSharedKey: function(remotePub){
      return new BigInteger(remotePub, 16, true);
    },
    /**
     * generate the key used for encryption and decryption with the remote publicKey
     * @param remotePub
     *    the publicKey fetched from the remote
     * @returns {String}
     */
    getEncryptKey: function(remotePub){
      return processible.create(remotePub)
        .process(codec.decodeToHex)
        .process(this.getSharedKey)
        .process(function(value){
          return value.toByteArray();
        })
        .process(function(value){
          return bytes.create(value).toHex();
        })
        .process(codec.encodeHex)
        .process(hash.hash, hash)
        .process(function(key){
          console.log('encrypt-key: ', key);
          return key;
        })
        .process(CryptoJS.enc.Utf8.parse)
        .done()
      ;
    }

  }, ['getPublicKey', 'getEncryptKey']);

});