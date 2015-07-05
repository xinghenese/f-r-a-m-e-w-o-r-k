/**
 * Created by Administrator on 2015/6/27.
 */

//dependencies
var _ = require('lodash');
var origin = require('../net/base/origin');
var eventemitter = require('./eventemitter.thenable');
var deferredData = require('./deferreddata');

//private fields

//core module to export
/**
 *
 * @type {Object}
 * @example
 *    var store = deferredStore.create({
 *        prop1: {
 *            value: value1,
 *            monitor: {
 *                initialized: true
 *            }
 *        },
 *        prop2: {
 *            value: value2,
 *            monitor: {
 *                updated: true
 *            }
 *        }
 *    })
 */
module.exports = origin.extend({
    fetch: function(key) {
        return checkAndGetProp(this, key).fetch();
    },
    fetchSync: function(key) {
        return checkAndGetProp(this, key).fetchSync();
    },
    update: function(key, value) {
        checkAndGetProp(this, key).update(value);
        return this;
    },
    init: function(data) {
        if (_.isPlainObject(data)) {
            var emitter =  eventemitter.create();
            var _data = this._data = {};
            _.forOwn(data, function(prop, key) {
                prop = deferredData.isPrototypeOf(prop)
                    ? prop
                    : deferredData.create(prop.value, prop.monitor, emitter, key)
                ;
                _.set(_data, key, prop);
            });
        }
    }
}, ['fetch', 'update']);

//module initialization


//private functions
function checkAndGetProp(store, key) {
    var prop = _.get(store._data, key);
    if (!deferredData.isPrototypeOf(prop)) {
      throw new Error('no valid keys named ' + key + ' found in deferreddata: ', store);
    }
    return prop;
}