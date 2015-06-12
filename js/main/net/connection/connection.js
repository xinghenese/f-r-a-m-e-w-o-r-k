/**
 * Created by Administrator on 2015/6/3.
 */

//dependencies
var eventemitter = require('../../utils/eventEmitter');
var _ = require('lodash');
var promise = require('../../utils/promise');
var State = require('./connectionstate');

console.log('eventEmitter: ', eventemitter);

//core module to export
module.exports = eventemitter.extend({
  'request': function(packet){
    return promise.create(packet);
  },

  'getState': function(){
    return State.INITIALIZING;
  },

  'isAuthorized': function(){
    return false;
  }
});