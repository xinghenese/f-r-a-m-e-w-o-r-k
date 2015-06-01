/**
 * Created by Administrator on 2015/5/28.
 */
define(function(require, exports, module){

  //dependencies
  var filter = require('./filter');
  var _ = require('lodash');

  //core module to export
  module.exports = filter.create({
    'notifyConfig': function(cfg){
      if(!_.isUndefined(cfg.needEncode)){
        this.enableWrite = !!cfg.needEncode;
      }
      if(!_.isUndefined(cfg.needDecode)){
        this.enableRead = !!cfg.needDecode;
      }
    }
  })

});