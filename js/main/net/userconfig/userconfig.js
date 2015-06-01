/**
 * Created by Administrator on 2015/5/30.
 */
define(function(require, exports, module){

  //private fields
  var _version = "4.0";
  var _uuid = "7e9d-501c-dbd816078039";
  var _configs = ['ver', 'uuid'];

  //core module to export
  module.exports = {
    'getVersion': function(){
      return _version;
    },
    'setVersion': function(version){
      _version = version;
    },
    'getUuid': function(){
      return _uuid;
    },
    'setUuid': function(uuid){
      _uuid = uuid;
    },
    'configs': function(){
      return _configs;
    }
  }

});