/**
 * Created by Administrator on 2015/7/10.
 */

//dependencies
var _ = require('lodash');

//private fields
var policy = {
    chain: function () {
        return chain(arguments);
    },
    chainRight: function () {
        return chain(arguments, 'right');
    },
    sequence: function () {
        return sequence(arguments);
    },
    sequenceRight: function () {
        return sequence(arguments, 'right');
    },
    merge: function () {
        return merge(arguments);
    },
    mergeRight: function () {
        return merge(arguments, 'right');
    },
    queue: function () {
        return queue(arguments);
    },
    queueRight: function () {
        return queue(arguments, 'right');
    }
};

//core module to export
module.exports = {
    /**
     *
     * @param configs {Object} {mixins: [], handleConflict: function(key){}}
     * @param defaultPolicy {Object}
     * @returns {null}
     */
    create: function (configs, defaultPolicy) {
        if (!isValidConfigs(configs)) {
            return null;
        }
        var mixinKeys = _.reduce(configs.mixins, function (memo, mixin) {
            return _(mixin).keys().union(memo).value();
        }, []);

        return _.reduce(mixinKeys, function (result, key) {
            // args = [key, mixin1.key, mixin2.key, ..., spec.key]
            var args = _.reduce(configs.mixins, function (memo, mixin) {
                if (_.has(mixin, key)) {
                    _.set(result, key, _.get(mixin, key));
                }
                memo.push(_.get(mixin, key));
                return memo;
            }, [key]);

            var value;

            // configs.handleConflict as priority
            if (_.isFunction(configs.handleConflict)) {
                value = configs.handleConflict.apply(null, args);
            }

            // defaultPolicy for handle mixins' conflicts by default
            if (_.isUndefined(value)) {
                var func = defaultPolicy && defaultPolicy[key];
                if (func && _.has(policy, func)) {
                    value = _.get(policy, func).apply(null, args);
                }
            }

            // adapt the overrides policy if no defaultPolicy provided
            if (_.isUndefined(value)) {
                value = overrides.apply(null, args);
            }

            if (!_.isUndefined(value)) {
                _.set(result, key, value);
            }

            return result;
        }, {});
    },
    policyName: {
        CHAIN: 'chain',
        CHAIN_RIGHT: 'chainRight',
        SEQUENCE: 'sequence',
        SEQUENCE_RIGHT: 'sequenceRight',
        MERGE: 'merge',
        MERGE_RIGHT: 'mergeRight',
        QUEUE: 'queue',
        QUEUE_RIGHT: 'queueRight'
    }
};

//module initialization


//private functions
function chain(methods, dir) {
    return serialize(methods || arguments, function (memo, method, args) {
        if (_.isFunction(method)) {
            if (!_.isUndefined(memo)) {
                return method.call(this, memo);
            }
            // allow to pass initial arguments for the first time. here we distinguish
            // out the first invocation via whether memo is undefined.
            return method.apply(this, args);
        }
        return memo;
    }, dir);
}

function sequence(methods, dir) {
    return serialize(methods || arguments, function (memo, method, args) {
        if (_.isFunction(method)) {
            method.apply(this, args);
        }
    }, dir);
}

function merge(methods, dir) {
    return serialize(methods || arguments, function (memo, method, args) {
        method = _.isFunction(method) ? method.apply(this, args) : method;
        return _.assign(memo, _.toPlainObject(method));
    }, dir, {});
}

function queue(methods, dir) {
    return serialize(methods || arguments, function (memo, method, args) {
        method = _.isFunction(method) ? method.apply(this, args) : method;
        return _(memo).push(method).value();
    }, dir, []);
}

function overrides() {
    return _.findLast(_(arguments).rest().value(), function (method) {
        return !!method;
    });
}

function serialize(methods, callback, dir, initValue) {
    dir = getReduceMethodName(dir);

    return function () {
        var args = _.toArray(arguments);
        return _[dir](_(methods).rest().value(), function (memo, method) {
            return callback.call(this, memo, method, args);
        }, initValue, this);
    };
}

function getReduceMethodName(dir) {
    return dir === 'right' ? 'reduceRight' : 'reduce';
}

function isValidConfigs(configs) {
    return configs
        && _.isObject(configs)
        && _.isArray(configs.mixins)
        && !_.isEmpty(configs.mixins);
}
