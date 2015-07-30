/**
 * Created by Administrator on 2015/6/11.
 */

//dependencies
var origin = require('./origin');
var _ = require('lodash');

//core module to export
module.exports = function (base, extras) {
    var proto;

    if (_.isFunction(base)) {
        proto = base.prototype;
    } else if (_.isObject(base)) {
        proto = base;
    } else {
        proto = Object.getPrototypeOf && Object.getPrototypeOf(base)
            || base.constructor.prototype;
    }

    return _.create(proto, _.assign({}, origin, extras));
};
