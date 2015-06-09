/**
 * Created by Administrator on 2015/5/28.
 */
//dependencies
var _ = require('lodash');
var filter = require('./filter');
var userconfigs = require('../userconfig/userconfig');

//core module to export
module.exports = filter.create({
  'processWritable': function(value, options){
    console.log('options: ', options);
    if(options.needWrap){
      return queryStringify(value);
    }
    return value;
  },
  'processReadable': function(value, options){
    if(options.needUnwrap){
      return decodeURIComponent(value.replace(/[\r\n]/gm, ''));
    }
    return value;
  }
});

//private functions.
function queryStringify(msg){
  return 'data=' + encodeURIComponent(msg) + "&" +
    "ver=" + userconfigs.getVersion() + "&" +
    "uuid=" + userconfigs.getUuid();
}