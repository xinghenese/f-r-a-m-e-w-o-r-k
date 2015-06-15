/**
 * Created by Administrator on 2015/6/11.
 */

//dependencies
var q = require('q');
var _ = require('lodash');
var originify = require('../net/base/originify');

//core module to export
var promise = module.exports = originify(q.makePromise);

promise.init = function(resolver){
  var self = this;
  var pro;

  if(_.isFunction(resolver)){
    pro = q.Promise(resolver);
  }else if(_.isError(resolver)){
    pro = q.reject(resolver);
  }else{
    pro = q(resolver);
  }

  _.forOwn(pro, function(value, key){
    _.set(self, key, value);
  });
};

promise.resolve = function(value){
  var self = promise.create(null);
  var pro = q(value);

  _.forOwn(pro, function(value, key){
    _.set(self, key, value);
  });
  return self;
};

promise.reject = function(reason){
  var self = promise.create(null);
  var pro = q.reject(reason);

  _.forOwn(pro, function(value, key){
    _.set(self, key, value);
  });
  return self;
};

//enable promise.then adapt to repeat object.
var then = q.makePromise.prototype.then;
promise.then = function(fulfilled, rejected, progressed){
  return promise.create(then.call(this, fulfilled, rejected, progressed));
};

promise['catch'] = function(rejected){
  return this.then(void 0, rejected, void 0);
};

promise.repeat = function(fulfilled, rejected){
  var self = this;
  var repeat = require('./repeat');
  var deferred = require('./deferredrepeat');
  var rep = deferred.create(null);

  self.then(function(value){
    var fulfilledValue = _fulfilled(value);
    if(!repeat.isPrototypeOf(fulfilledValue)){
      value = fulfilledValue;
    }
    rep.emit('resolve', {
      'entity': repeat.create(fulfilledValue),
      'value': value
    });
    return value;
  }, function(reason){
    var rejectedReason = _rejected(reason);
    if(!repeat.isPrototypeOf(rejectedReason)){
      reason = rejectedReason;
    }
    rep.emit('reject', {
      'entity': repeat.create(rejectedReason),
      'reason': reason
    });
    return reason;
  });

  return rep;

  function _fulfilled(value){
    try{
      return typeof fulfilled === "function" ? fulfilled(value) : value;
    }catch(exception){
      return exception;
    }
  }

  function _rejected(exception){
    try{
      return typeof rejected === "function" ? rejected(exception) : exception;
    }catch(exception){
      return exception;
    }
  }
};

promise.Promise = q;
