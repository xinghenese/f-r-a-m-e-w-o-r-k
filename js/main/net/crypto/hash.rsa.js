/**
 * Created by Administrator on 2015/5/25.
 *
 * an RSA implementaion of hash
 */

//dependencies
var _ = require('lodash');
var hash = require('./hash');

//private const fields
var CIPHER_DELIMETER = 'l'; // l letter;

//core module to export
module.exports = hash.extend({
    hashEncode: function (rawText, hashKey) {
        if (!rawText || !hashKey) {
            return '';
        }
        rawText = rawText + '';
        hashKey = hashKey + '';

        var hashText = '';
        var strLength = rawText.length;
        var pwdLength = hashKey.length;

        for (var i = 0, j = 0; i < strLength; i++) {
            if (i > 0) {
                hashText += CIPHER_DELIMETER;
            }
            hashText += rawText.charCodeAt(i) ^ hashKey.charCodeAt(j);
            j = j % pwdLength + 1;
        }

        return hashText;
    },

    hashDecode: function (hashText, hashKey) {
        if (!hashText || !hashKey) {
            return '';
        }
        hashText = hashText + '';
        hashKey = hashKey + '';

        var rawText = '';
        var pwdLength = hashKey.length;
        var hashTexts = hashText.split(CIPHER_DELIMETER);
        var i = 0;

        _.forEach(hashTexts, function (text, index) {
            rawText += String.fromCharCode(parseInt(text) ^ hashKey.charCodeAt(i));
            i = i % pwdLength + 1;

        });

        return rawText;
    }
});
