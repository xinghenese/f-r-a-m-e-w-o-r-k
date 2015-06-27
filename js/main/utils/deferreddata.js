/**
 * Created by Administrator on 2015/6/27.
 */

//dependencies
var _ = require('lodash');
var origin = require('../net/base/origin');
var eventemitter = require('./eventemitter.thenable');
var underwatch = require('./underwatch');

//private fields

//core module to export
module.exports = origin.extend({
  fetch: function(key) {
    var prop = _.get(this._data, key);
    if (!underwatch.isPrototypeOf(prop)) {
      throw new Error('no valid keys named ' + key + ' found in deferreddata: ', this);
    }
    return prop.fetch();
  },
  update: function(key, value) {
    var prop = _.get(this._data, key);
    if (underwatch.isPrototypeOf(prop)) {
      prop.update(value);
    }
    return this;
  },
  init: function(data) {
    if (_.isPlainObject(data)) {
      var emitter =  eventemitter.create();
      _.forOwn(data, function(prop, key) {
        _.set(this._data, key, underwatch.create(prop.value, prop.monitor, emitter, key));
      });
    }
  }
}, ['fetch', 'update']);

//module initialization


//private functions