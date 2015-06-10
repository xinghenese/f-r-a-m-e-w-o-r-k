/**
 * Created by Administrator on 2015/6/10.
 *
 * Wrapper of repeating Promises which implements Promise Interface
 * [then, catch, resolve, reject]
 */

//dependencies
var origin = require('../net/base/origin');
var q = require('q');
var _ = require('lodash');

//core module to export
module.exports = origin.extend({
  /**
   * register sucessCallback and failCallback for all promises and then
   * notify all promises to fulfill tasks along the repeat chain.
   *
   * @param callback1 {Function}
   * @param callback2 {Function}
   * @returns {exports}
   */
  'then': function(callback1, callback2){
    if(this._isDone){
      return this;
    }
    callback1 = _.isFunction(callback1) ? callback1 : void 0;
    callback2 = _.isFunction(callback2) ? callback2 : void 0;
    this._tasks.push([callback1, callback2]);
    notifyPromises(this);
    return this;
  },
  /**
   * register failCallback for all promises and then notify all promises
   * to fulfill tasks along the repeat chain.
   *
   * @param callback {Function}
   * @returns {exports}
   */
  'catch': function(callback){
    if(this._isDone){
      return this;
    }
    return this.then(void 0, callback);
  },
  /**
   * add resolved promise with value into promise list.
   *
   * @param value {*}
   * @returns {exports}
   */
  'resolve': function(value){
    this._promises.push({
      'promise': q(value),
      'stay': 0
    });
    notifyPromises(this);
    return this;
  },
  /**
   * add rejected promise with value into promise list.
   *
   * @param reason {*}
   * @returns {exports}
   */
  'reject': function(reason){
    this._promises.push({
      'promise': q.reject(reason),
      'stay': 0
    });
    notifyPromises(this);
    return this;
  },
  /**
   * symbolize that the repeat chain would be done and forbidden upcoming
   * callbacks from being registered by repeat.then() or repeat.catch().
   * besides, promises which have walked through the repeat chain would be
   * removed later.
   * @returns {exports}
   */
  'done': function(){
    this._isDone = true;
    return this;
  },
  /**
   * make initializer of repeat compatible with that of promise.
   * as for promise creation:
   *    promise = new Promise/Q.Promise(function(resolve, reject){});
   * as for repeat creation:
   *    repeating = repeat.create(function(resolve, reject){});
   *
   * @param executor {Function}
   */
  'init': function(executor){
    var self = this;
    //list to hold promises.
    self._promises = [];
    //list to hold tasks registered by repeat.then() or repeat.catch().
    self._tasks = [];

    if(_.isFunction(executor)){
      executor.call(self, function(value){
        return self.resolve(value);
      }, function(reason){
        return self.reject(reason);
      });
    }
  },
  '_isDone': false
});

//private functions
function notifyPromises(repeat){
  var promises = repeat._promises;
  var tasks = _(repeat._tasks);
  var taskCount = tasks.value().length;
  console.log('taskCount: ', taskCount);

  if(_.isEmpty(promises) || _.isEmpty(tasks)){
    return;
  }

  _.forEach(promises, function(promise, index){
    promise.promise = tasks.slice(promise.stay).reduce(function(currentPromise, taskPair){
      var successCallback = taskPair[0] ? function(value){
        //mark the step of current promise on the repeat chain.
        promise.stay ++;
        //bind thisArg.
        return taskPair[0].call(currentPromise, value);
      } : void 0;
      var failCallback = taskPair[1] ? function(reason){
        //mark the step of current promise on the repeat chain.
        promise.stay ++;
        //bind thisArg.
        return taskPair[1].call(currentPromise, reason);
      } : void 0;

      return currentPromise.then(successCallback, failCallback);
    }, promise.promise);

    destroyIfDone(repeat, index);
  });
}

function destroyIfDone(repeat, index){
  if(repeat._isDone){
    var promises = repeat._promises;
    var promise = promises[index];
    var destroyCallback = destroy(promises, index);

    promise.promise.then(destroyCallback, destroyCallback);
  }
}

function destroy(promises, index){
  return function(){
    console.log('delete');
    promises[index] = null;
    promises.splice(index, 1);
  }
}