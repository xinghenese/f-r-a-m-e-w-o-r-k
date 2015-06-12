/**
 * Created by Administrator on 2015/6/3.
 */

//dependencies
var _ = require('lodash');
var EventEmitter = require('browserify/node_modules/events').EventEmitter;
var originify = require('../net/base/originify');
var promise = require('./promise');
var repeat = require('./repeat');

//core module to export
var eventEmitter = module.exports = originify(EventEmitter);

var on = EventEmitter.prototype.on;
var once = EventEmitter.prototype.once;

eventEmitter.on = function(event, callback){
  var self = this;
  callback = _.isFunction(callback) ? callback : function(msg){
    return msg;
  };

  return repeat.create(function(resolve, reject){
    on.call(self, event, function(msg){
      if(!msg){
        reject('empty message received');
        return;
      }
      resolve(msg);
    })
  }).then(function(msg){
    return callback(msg);
  })
};

eventEmitter.once = function(event, callback){
  var self = this;
  callback = _.isFunction(callback) ? callback : function(msg){
    return msg;
  };

  return promise.create(function(resolve, reject){
    once.call(self, event, function(msg){
      if(!msg){
        reject('empty message received');
        return;
      }
      resolve(msg);
    })
  }).then(function(msg){
    return callback(msg);
  })
};