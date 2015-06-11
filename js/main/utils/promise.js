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
  var pro = q.Promise(resolver);
  _.forOwn(pro, function(value, key){
    _.set(self, key, value);
  });
};
promise.Promise = q;