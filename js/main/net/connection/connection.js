/**
 * Created by Administrator on 2015/6/3.
 */

//dependencies
var _ = require('lodash');
var State = require('./connectionstate');
var promise = require('../../utils/promise');
var eventemitter = require('../../utils/eventemitter.thenable');

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