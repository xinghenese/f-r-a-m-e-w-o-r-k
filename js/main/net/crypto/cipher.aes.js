/**
 * Created by Administrator on 2015/5/30.
 *
 * an AES implementation of cipher
 */

//dependencies
var CryptoJS = require('./core');
var cipher = require('./cipher');

//private fields
var aes = CryptoJS.AES;

//core module to export
module.exports = cipher.create({
    'encrypt': function (text, key) {
        return aes.encrypt(text, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    },
    'decrypt': function (text, key) {
        return aes.decrypt(text, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    }
});
