/**
 * Created by Administrator on 2015/6/27.
 */

//dependencies
var origin = require('../net/base/origin');
var promise = require('./promise');
var eventemitter = require('./eventemitter.thenable');

//private fields
var DEFAULT_EVENT = 'change';
var DEFAULT_MONITOR_CONFIG = {
  initialized: true,
  updated: false,
  deleted: false
};

//core module to export
module.exports = origin.extend({
  fetch: function() {
    return this._promise;
  },
  update: function(value) {
    if (eventemitter.isPrototypeOf(this._emitter)
      && value != void 0
      && this.value !== value) {
      var previous = this.value;
      if (this.value && _.isObject(this.value)) {
        _.assign(this.value, value);
      } else {
        this.value = value;
      }
      this._emitter.emit(this._event, {
        previous: previous,
        current: this.value,
        differential: value
      });
    }
    return this;
  },
  /**
   *
   * @param value
   * @param monitor
   * @param emitter
   * @param event
   */
  init: function(value, monitor, emitter, event) {
    monitor = configMonitor(monitor);
    event = event || DEFAULT_EVENT;
    emitter = eventemitter.isPrototypeOf(emitter) ? emitter : eventemitter.create();
    value = value === null ? {} : value;

    this.value = value;
    this.type = _.isArray(value)
      ? 'array'
      : _.isObject(value)
        ? 'object'
        : 'primitive'
    ;

    switch (true) {
      case monitor.updated:
        this._emitter = emitter;
        this._event = event;
        this._promise = emitter.on(event);
        break;
      case monitor.initialized:
        this._emitter = emitter;
        this._event = event;
        this._promise = emitter.once(event);
        break;
      default:
        this._promise = promise.create(value);
    }
  }
}, ['fetch', 'update']);

//module initialization


//private functions
function configMonitor(monitor){
  return _.mapValues(DEFAULT_MONITOR_CONFIG, function(value, key){
    if(_.has(monitor, key)){
      return !!_.get(monitor, key);
    }
    return value;
  });
}