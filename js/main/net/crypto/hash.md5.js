/**
 * Created by Administrator on 2015/5/25.
 *
 * an MD5 implementation of hash
 */

//dependencies
var CryptoJS = require('./core');
var hash = require('./hash');

//core module to export
module.exports = hash.create({
  hashEncode: function(msg){
    return CryptoJS.MD5(msg).toString();
  }
});