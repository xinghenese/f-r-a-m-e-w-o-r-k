/**
 * Created by Administrator on 2015/5/28.
 */

//dependencies
var _ = require('lodash');
var filter = require('./filter');
var userconfigs = require('../userconfig/userconfig');

//core module to export
module.exports = filter.create({
  /**
   * parse the value into a plain object
   * @param value {String}
   * @param options {Object}
   * @returns {Object}
   */
  'processReadable': function(value, options){
//      return JSON.parse(value);
    value = value.replace(/^[^{]*?\{/, '{').replace(/[\r\n]/gm, '');
    console.log(value);
    var str = '{"data":{"uid":"212","ct":1433742045,"eape":1,"eaps":0,"eapp":1,"easp":0,"en":1,"evn":1,"ecjn":1,"epn":1,"ern":1,"epape":1,"erape":1,"epapp":1,"erapp":1,"epaps":0,"eraps":0,"epasp":0,"erasp":0,"tk":"pu2MVcVlOVS6JI5l0aTpR0t2dJ5waMVBKPTvTd5zFSHP2BKSH6Vm-_cPYEgIunb457LVv-_KYMTz9rizssHpUX-Eb8t_utIOWQG27BBw4SdkytlLqzGFWFUZW5o4-cygyzou6mk5V7_YDxTfQCQe9VPtmpcNkwd8N2os8VLJ4ec","rtk":"E3odvRHYyJcFRGrn1cb9hwN2kEwNUnR06-EAn3S8Qve0H1stj1Tr5wNFjTqIBjRVSR5RlrogQmaBHbUTpjWzAOG0hi_b88fA0xsIve5AOXFFdhOoI0H_zWzWdjcV2zE9_gomZdMY56EPtCPqM-7vYrE35g0YUs84955AA5xU9B4","trt":432000000,"nn":"我在学校","pt":"fdsafds\/fdsafdas\/fasf\/tmp.jpg","hp":0,"dnds":1,"urs":[],"ups":[]},"r":0}';
    console.log(CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(str)));
    return JSON.parse(value);
  },
  /**
   * transfer the value into a string
   * @param value {Object}
   * @param options {Object}
   * @returns {String}
   */
  'processWritable': function(value, options){
    return JSON.stringify(value);
  }
});