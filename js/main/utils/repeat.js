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
    registerCallbacks(this, callback1, callback2);
    return notifyAllPromises(this);
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
    this._promises.push(q(value));
    return startPromise(this, -1);
  },
  /**
   * add rejected promise with value into promise list.
   *
   * @param reason {*}
   * @returns {exports}
   */
  'reject': function(reason){
    this._promises.push(q.reject(reason));
    return startPromise(this, -1);
  },
  /**
   * symbolize that the repeat chain would be done and forbidden upcoming
   * callbacks from being registered by repeat.then() or repeat.catch().
   * besides, promises which have walked through the repeat chain would be
   * removed later.
   * @returns {exports}
   */
  'done': function(){
    if(this._isDone){
      return this;
    }
    this._isDone = true;
    return notifyPromisesDestroy(this);
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
function registerCallbacks(repeat, callback1, callback2){
  callback1 = _.isFunction(callback1) ? callback1 : void 0;
  callback2 = _.isFunction(callback2) ? callback2 : void 0;
  repeat._tasks.push([callback1, callback2]);

  return repeat;
}

function notifyAllPromises(repeat){
  var promises = repeat._promises;
  var task = _.last(repeat._tasks);

  _.forEach(promises, function(promise, index){
    promises[index] = promise.then(task[0], task[1]);
  });

  return repeat;
}

function notifyPromisesDestroy(repeat){
  var promises = repeat._promises;
  var destroyCallback;

  _.forEach(promises, function(promise, index){
    destroyCallback = destroy(promises, index);
    promise.then(destroyCallback, destroyCallback);
  });

  return repeat;
}

function startPromise(repeat, index, start){
  var promises = repeat._promises;
  var promiseLength = promises.length;
  var pos = (promiseLength + index) % promiseLength;
  var currentPromise = promises[pos];
  var tasks = _(repeat._tasks);
  var destroyCallback;

  currentPromise = tasks.slice(start).reduce(function(promise, taskPair){
    return promise.then(taskPair[0], taskPair[1]);
  }, currentPromise);

  if(repeat._isDone){
    destroyCallback = destroy(promises, pos);
    currentPromise = currentPromise.then(destroyCallback, destroyCallback);
  }

  promises[pos] = currentPromise;

  return repeat;
}

function destroy(promises, index){
  return function(){
    console.log('delete');
    promises[index] = null;
    promises.splice(index, 1);
  }
}