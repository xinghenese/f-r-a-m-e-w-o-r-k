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
module.exports = origin.extend({
    fetch: function(key) {
        var prop = _.get(this._data, key);
        if (!deferredData.isPrototypeOf(prop)) {
            throw new Error('no valid keys named ' + key + ' found in deferreddata: ', this);
        }
        return prop.fetch();
    },
    update: function(key, value) {
        var prop = _.get(this._data, key);
        if (deferredData.isPrototypeOf(prop)) {
            prop.update(value);
        }
        return this;
    },
    init: function(data) {
        if (_.isPlainObject(data)) {
            var emitter =  eventemitter.create();
            var _data = this._data = {};
            _.forOwn(data, function(prop, key) {
                _.set(_data, key, deferredData.create(prop.value, prop.monitor, emitter, key));
            });
        }
    }
}, ['fetch', 'update']);

//module initialization


//private functions