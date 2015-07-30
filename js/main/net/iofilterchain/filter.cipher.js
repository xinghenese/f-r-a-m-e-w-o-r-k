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
    'processReadable': function (value, options) {
        if (options.needDecrypt && options.encryptKey) {
            return cipher.decrypt(value, options.encryptKey);
        }
        return value;
    },
    /**
     * process the data by decryption and then write to the connection
     * or next filter.
     * @param value
     * @param options {Object}
     * @returns {*}
     */
    'processWritable': function (value, options) {
        if (options.needEncrypt && options.encryptKey) {
            return cipher.encrypt(value, options.encryptKey);
        }
        return value;
    }
});
