/**
 * Created by Administrator on 2015/6/11.
 */

//dependencies
var q = require('q');
var _ = require('lodash');
var originify = require('../net/base/originify');

//core module to export
var promise = module.exports = originify(q.makePromise);

promise.init = function (resolver) {
    var self = this;
    var pro;

    if (_.isFunction(resolver)) {
        pro = q.Promise(resolver);
    } else if (_.isError(resolver)) {
        pro = q.reject(resolver);
    } else {
        pro = q(resolver);
    }

    _.forOwn(pro, function (value, key) {
        _.set(self, key, value);
    });
};
//enable promise.then adapt to repeat object.
var then = q.makePromise.prototype.then;
promise.then = function (fulfilled, rejected, progressed) {
    var repeat = require('./repeat');

    if (repeat && repeat.isPrototypeOf(fulfilled)) {
        return fulfilled;
    }
    return promise.create(then.call(this, fulfilled, rejected, progressed));
};
promise.finally = function (callbakc) {
    return promise.create(then.call(this, callback, callbakc));
};
promise.repeat = function (resolver) {
    var repeat = require('./repeat');

    if (repeat) {
        return repeat.create(resolver);
    }
    return this.then(function () {
        return promise.create(resolver);
    })
};
promise.Promise = q;
