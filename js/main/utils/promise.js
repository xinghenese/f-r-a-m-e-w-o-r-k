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
  var repeat = require('./repeat');
  var value = this.inspect().value;

  try{
    value = _.isFunction(fulfilled) ? fulfilled(value) : value;
    if(repeat.isPrototypeOf(value)){
      return value;
    }
  }catch(exception){
    return q.reject(exception);
  }

  return then.call(this, fulfilled, rejected, progressed);
};
promise.Promise = q;
