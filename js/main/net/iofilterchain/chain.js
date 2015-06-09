/**
 * Created by Administrator on 2015/5/29.
 */

//dependencies
var _ = require('lodash');
var q = require('q');
var origin = require('../base/origin');
var filter = require('./filter');
var factory = require('./factory');

//private fields
var _tasks = _.map(['wrapper', 'cipher', 'zipper', 'json', 'iohandler'], function(item){
  return factory.createFilter(item);
});

//core module to export
module.exports = origin.extend({
  /**
   *
   * @param msg {Object}
   * @param options {Object}
   * @returns {Q.Promise}
   */
  'filterWrite': function(msg, options){
    return _.reduceRight(this.tasks, function(promise, task, index){
      return promise.then(function(value){
        return task.write(value, options);
      })
    }, q(msg));
  },
  /**
   *
   * @param msg {Object}
   * @param options {Object}
   * @returns {Q.Promise}
   */
  'filterRead': function(msg, options){
    return _.reduce(this.tasks, function(promise, task, index){
      return promise.then(function(value){
        return task.read(value, options);
      })
    }, q(msg));
  },
  /**
   * filter tasks
   */
  'tasks': _tasks
});