/**
 * Created by Administrator on 2015/5/29.
 *
 * factory for filter creation.
 */
define(function(require, exports, module){

  //dependencies
  var filter = require('./filter');
  var json = require('./filter.json');
  var codec = require('./filter.codec');
  var crypto = require('./filter.crypto');
  var zipper = require('./filter.zipper');
  var wrapper = require('./filter.wrapper');
  var iohandler = require('./filter.iohandler');

  //core module to export
  module.exports = {
    createFilter: function(tag){
      switch(tag){
        case 'json':
          return json;
        case 'codec':
          return codec;
        case 'zipper':
          return zipper;
        case 'crypto':
          return crypto;
        case 'wrapper':
          return wrapper;
        case 'iohandler':
          return iohandler;
        default:
          return filter.create();
      }
    }
  }

});