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
//enable promise.then adapt to repeat object.
var then = q.makePromise.prototype.then;
promise.then = function(fulfilled, rejected, progressed){
  return promise.create(then.call(this, fulfilled, rejected, progressed));
};

promise.repeat = function(fulfilled, rejected){
  var self = this;
  var repeat = require('./repeat');
  var deferred = require('./deferredrepeat');
  var rep = deferred.create(null);

  self.then(function(value){
    var _rep = repeat.create(_fulfilled(value));
    console.log('_rep.proto.repeat: ', repeat.isPrototypeOf(_rep));
    console.log('_rep: ', rep);
    rep.emit('resolve', _rep);
    return value;
  }, function(reason){
    rep.emit('reject', _rejected(reason));
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
