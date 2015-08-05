/**
 * Created by Administrator on 2015/6/15.
 */

//dependencies
var promise = require('./promise');
var repeat = require('./repeat');

module.exports = repeat.extend({
    'then': function (callback1, callback2) {
        var self = this;
        self._resolvedPromise = resolvedRepeat(this).then(function (rep) {
            self._source.then(callback1, callback2);
        });
        return this;
    },
    'catch': function (callback) {
        this._resolvedPromise = resolvedRepeat(this).then(void 0, function (rep) {
            self._source.catch(callback);
        });
        return this;
    },
    'resolve': function (value) {
        this._source.resolve(value);
        return this;
    },
    'reject': function (reason) {
        this._source.reject(reason);
        return this;
    },
    'done': function () {
        this._source.done();
        this._isDone = true;
        return this;
    },
    'init': function (resolver) {
        if (resolver === null) {
            return;
        }
        return repeat.create(resolver);
    }
});

function resolvedRepeat(deferred) {
    if (!deferred._resolvedPromise) {
        deferred._resolvedPromise = promise.create(function (resolve, reject) {
            deferred.once('resolve', function (msg) {
                deferred._source = msg.entity;
                resolve(msg.value);
            });
            deferred.once('reject', function (msg) {
                deferred._source = msg.entity;
                reject(msg.reason);
            });
        });
    }
    return deferred._resolvedPromise;
}
