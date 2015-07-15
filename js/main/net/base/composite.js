/**
 * Created by Administrator on 2015/7/10.
 */

//dependencies
var _ = require('lodash');

//private fields
var policy = {
    chain: chain,
    chainRight: chainRight,
    sequence: sequence,
    sequenceRight: sequenceRight,
    merge: merge,
    mergeRight: mergeRight,
    queue: queue,
    queueRight: queueRight
};

//core module to export
module.exports = {
    /**
     *
     * @param configs {Object} {mixins: [], handleConflict: function(key){}}
     * @param defaultPolicy {Object}
     * @returns {null}
     */
    create: function(configs, defaultPolicy) {
        if (!isValidConfigs(configs)) {
            return null;
        }
        var keys = _.reduce(configs.mixins, function(memo, mixin) {
            return _(mixin).keys().union(memo).value();
        }, []);

        return _.reduce(keys, function(result, key) {
            var args = _.reduce(configs.mixins, function(memo, mixin) {
                if (_.has(mixin, key)) {
                    _.set(result, key, _.get(mixin, key));
                }
                memo.push(_.get(mixin, key));
                return memo;
            }, [key]);

            var value;

            if (_.isFunction(configs.handleConflict)) {
                value = configs.handleConflict.apply(null, args);
            }

            if (_.isUndefined(value)) {
                var func = defaultPolicy && defaultPolicy[key];
                if (func && _.has(policy, func)) {
                    value = _.get(policy, func).apply(null, args);
                }
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
function chain() {
    var args = _.toArray(arguments);

    return function() {
        return _.reduce(args, function(memo, method) {
            if (_.isFunction(method)) {
                return method.call(this, memo);
            }
            return memo;
        }, void 0, this);
    };
}

function chainRight() {
    var args = _.toArray(arguments);

    return function() {
        return _.reduceRight(args, function(memo, method) {
            if (_.isFunction(method)) {
                return method.call(this, memo);
            }
            return memo;
        }, void 0, this);
    };
}

function sequence() {
    var args = _.toArray(arguments);

    return function() {
        return _.reduce(args, function(memo, method) {
            if (_.isFunction(method)) {
                method.call(this);
            }
        }, void 0, this);
    };
}

function sequenceRight() {
    var args = _.toArray(arguments);

    return function() {
        return _.reduceRight(args, function(memo, method) {
            if (_.isFunction(method)) {
                method.call(this);
            }
        }, void 0, this);
    };
}

function merge() {
    var args = _.toArray(arguments);

    return function() {
        return _.reduce(args, function(memo, method) {
            method = _.isFunction(method) ? method.call(this) : method;
            return _.assign(memo, _.toPlainObject(method));
        }, {}, this);
    };
}

function mergeRight() {
    var args = _.toArray(arguments);

    return function() {
        return _.reduceRight(args, function(memo, method) {
            method = _.isFunction(method) ? method.call(this) : method;
            return _.assign(memo, _.toPlainObject(method));
        }, {}, this);
    };
}

function queue() {
    var args = _.toArray(arguments);

    return function() {
        return _.reduce(args, function(memo, method) {
            method = _.isFunction(method) ? method.call(this) : method;
            return _(memo).push(method).value();
        }, [], this);
    };
}

function queueRight() {
    var args = _.toArray(arguments);

    return function() {
        return _.reduceRight(args, function(memo, method) {
            method = _.isFunction(method) ? method.call(this) : method;
            return _(memo).push(method).value();
        }, [], this);
    };
}

function isValidConfigs(configs) {
    return configs
        && _.isObject(configs)
        && _.isArray(configs.mixins)
        && !_.isEmpty(configs.mixins);
}