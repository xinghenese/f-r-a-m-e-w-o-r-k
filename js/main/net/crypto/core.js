/**
 * Created by Administrator on 2015/6/9.
 */
var global = window || this;

module.exports = global.CryptoJS = require('browserify-cryptojs');
require('browserify-cryptojs/components/md5');
require('browserify-cryptojs/components/enc-base64');
require('browserify-cryptojs/components/evpkdf');
require('browserify-cryptojs/components/cipher-core');
require('browserify-cryptojs/components/mode-ecb');
require('browserify-cryptojs/components/aes');