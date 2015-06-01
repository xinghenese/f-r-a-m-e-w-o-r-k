/**
 * Created by Administrator on 2015/5/29.
 */
define(function(require, exports, module){

  //dependencies
  var filter = require('./filter');
  var factory = require('./factory');
  var _ = require('lodash');
  var origin = require('../base/origin');
  var q = require('q');

  //private fields
  var tasks = _.map(['wrapper', 'codec', 'crypto', 'zipper', 'json', 'iohandler'], function(item){
    return factory.createFilter(item);
  });

  //core module to export
  module.exports = origin.extend({
    /**
     *
     * @param msg {Object|protocolpacket}
     * @returns {Q.Promise}
     */
    'filterWrite': function(msg){
      return _.reduceRight(tasks, function(promise, task){
        return promise.then(function(value){
          return task.write(value);
        })
      }, q(msg));
    },
    /**
     *
     * @param msg {Object|protocolpacket}
     * @returns {Q.Promise}
     */
    'filterRead': function(msg){
      return _.reduce(tasks, function(promise, task){
        return promise.then(function(value){
          return task.read(value);
        })
      }, q(msg));
    },
    /**
     * @param cfg {Object}
     * @returns {exports}
     */
    'config': function(cfg){
      console.log('chain.cfg: ', cfg);
      _.forEach(tasks, function(task){
        task.notifyConfig(cfg);
      });
      return this;
    }
  });

});