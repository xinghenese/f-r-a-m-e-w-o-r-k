/**
 * Created by Administrator on 2015/7/10.
 */

//dependencies
var _ = require('lodash');

//private fields


//core module to export
module.exports = {
    /**
     *
     * @param configs {Object} {mixins: [], handleConflict: function(key){}}
     * @returns {null}
     */
    create: function(configs) {
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

            if (_.isFunction(configs.handleConflict)) {
                var value = configs.handleConflict.apply(null, args);
                if (!_.isUndefined(value)) {
                    _.set(result, key, value);
                }
            }

            return result;
        }, {});
    }
};

//module initialization


//private functions
function isValidConfigs(configs) {
    return configs
        && _.isObject(configs)
        && _.isArray(configs.mixins)
        && !_.isEmpty(configs.mixins);
}