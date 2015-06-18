/**
 * Created by Administrator on 2015/6/14.
 */

//dependencies
var _ = require('lodash');
var eventEmitter = require('./eventemitter');
var promise = require('./promise');
var repeat = require('./repeat');

//core module to export
module.exports = eventEmitter.extend({
  'on': on,
  'once': once
}, ['on', 'once']);

function on(event, callback){
  if(this._onceTag){
    eventEmitter.on.call(this, event, callback);
    this._onceTag = false;
    return this;
  }
  var self = this;

  return repeat.create(function(resolve, reject){
    eventEmitter.on.call(self, event, function(msg){
      if(!msg){
        reject('empty message received');
        return;
      }
      resolve(msg);
    })
  }).then(function(msg){
    return _.isFunction(callback) ? callback(msg) : msg;
  })
}

function once(event, callback){
  var self = this;

  return promise.create(function(resolve, reject){
    //eventEmitter.once would eventually invoke this.on. here we set
    //a flag in order to invoke original eventEmitter.on instead of
    //the overridden this.on.
    self._onceTag = true;
    eventEmitter.once.call(self, event, function(msg){
      if(!msg){
        reject('empty message received');
        return;
      }
      resolve(msg);
    })
  }).then(function(msg){
    return _.isFunction(callback) ? callback(msg) : msg;
  })
}