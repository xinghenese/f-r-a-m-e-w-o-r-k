/**
 * Created by Administrator on 2015/6/3.
 */

//dependencies
var session = require('./iosession');
var _ = require('lodash');

//private fields
var sessioncache = {};

console.log(session);

//core module to export
module.exports = session.extend({
  'cache': function(tag, data){
    _.set(sessioncache, tag, data);
    return this;
  },
  'fetch': function(tag){
    return _.get(sessioncache, tag);
  },
  'has': function(tag){
    return _.has(sessioncache, tag);
  }
});