/**
 * Created by Administrator on 2015/5/30.
 *
 * factory for crypto, codec, hash, compress and keyExchange creation.
 */

//dependencies
var base64 = require('./codec.base64');
var gzip = require('./compress.gzip');
var md5 = require('./hash.md5');
var rsa = require('./hash.rsa');
var hellman = require('./keyexchange.hellman');
var aes = require('./cipher.aes');

//core module to export
module.exports = {
    /**
     * create a codec implementation.
     * @param tag {String|undefined}
     * @returns {codec} base64 !default.
     */
    createCodec: function (tag) {
        switch (tag) {
            case 'base64':
                return base64;
            default:
                return base64;
        }
    },
    /**
     * create a cipher implementation.
     * @param tag {String|undefined}
     * @returns {cipher} aes !default.
     */
    createCipher: function (tag) {
        switch (tag) {
            case 'aes':
                return aes;
            default:
                return aes;
        }
    },
    /**
     * create a compress implementation.
     * @param tag {String|undefined}
     * @returns {compress} gzip !default.
     */
    createCompressor: function (tag) {
        switch (tag) {
            case 'gzip':
                return gzip;
            default:
                return gzip;
        }
    },
    /**
     * create a hash implementation.
     * @param tag {String|undefined}
     * @returns {hash} md5 !default.
     */
    createHash: function (tag) {
        switch (tag) {
            case 'md5':
                return md5;
            case 'rsa':
                return rsa;
            default:
                return md5;
        }
    },
    /**
     * create a keyExchange implementation.
     * @param tag {String|undefined}
     * @returns {keyExchange} hellman !default.
     */
    createKeyExchange: function (tag) {
        switch (tag) {
            case 'hellman':
                return hellman;
            default:
                return hellman;
        }
    }
};
