/**
 * Created by Administrator on 2015/5/30.
 */

//dependencies
var _ = require('lodash');

//private fields
var profile = {
  'os': "android",
  'di': "pc",
  'dv': "1",
  'uid': "212",
  'uuid': "7e9d-501c-dbd816078039",
  'ver': "4.0",
  "v": "1.0",
  'zip': "1",
  'devn': "Sony Z3+",
  'tk': void 0
};
var _configs = ['ver', 'uuid'];

var http2socket = {
  'uid': "msuid",
  'dv': "dev",
  'tk': "token"
};

var socket2http = {
  'msuid': "uid",
  'dev': "dv",
  'token': "tk"
};


//core module to export
module.exports = {
  'get': function(key){
    return _.get(profile, _getKey(key));
  },
  'set': function(key, value){
    _.set(profile, _getKey(key), value);
    return this;
  },
  'subset': function(keys){
    if(!keys){
      return _.assign({}, profile)
    }
    return _.pick(profile, _.map(keys, _getKey));
  },
  'socksubset': function(keys){
    return _.mapKeys(this.subset(keys), function(value, key){
      return _.get(http2socket, key) || key;
    })
  },
  'getToken': function(){
    return this.get('tk');
  },
  'getVersion': function(){
    return this.get('ver');
  },
  'setVersion': function(version){
    return this.set('ver', version);
  },
  'getUuid': function(){
    return this.get('uuid');
  },
  'setUuid': function(uuid){
    return this.set('uuid', uuid);
  },
  'configs': function(){
    return _configs;
  }
};

function _getKey(key){
  return _.get(socket2http, key) || key;
}