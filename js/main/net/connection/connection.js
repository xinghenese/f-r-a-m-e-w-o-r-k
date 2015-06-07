/**
 * Created by Administrator on 2015/6/3.
 */
define(function(require, exports, module){

  //dependencies
  var eventemitter = require('../../utils/eventEmitter');
  var _ = require('lodash');
  var q = require('q');
  var State = require('./connectionstate');

  console.log('eventEmitter: ', eventemitter);

  //core module to export
  module.exports = eventemitter.extend({
    /**
     *
     * @param packet {Object|String}
     * @returns {Q.Promise}
     */
    'request': function(packet){
      return q(packet);
    },

    'getState': function(){
      return State.INITIALIZING;
    },

    'isAuthorized': function(){
      return false;
    }
  });


});