/**
 * Created by Administrator on 2015/6/27.
 */

//dependencies
var _ = require('lodash');
var origin = require('../net/base/origin');
var promise = require('./promise');
var eventemitter = require('./eventemitter.thenable');

//private fields
var DEFAULT_EVENT = 'change';
var DEFAULT_MONITOR_CONFIG = {
    initialized: false,
    updated: false,
    deleted: false
};

//core module to export
/**
 *
 * @type {Object}
 * @example
 *    var data = deferredData.create({
 *      value: someValue,
 *      monitor: configObject,
 *      emitter: eventEmitter,
 *      event: someEvent
 *    })
 */
module.exports = origin.extend({
    /**
     * <dl>
     * <dt>get the value of the data asynchronously</dt>
     * <dd><ul><li>
     *   if data.monitor.updated is true, doSomethingWith will be
     * invoked with the newest value every time the value of the data
     * has been updated.
     * </li><li>
     *   if data.monitor.updated is false and data.monitor.initialized
     * is true, doSomethingWith will only be invoked once the value of
     * the data has been changed for the first time.
     * </li><li>
     *   if data.monitor.updated is false and data.monitor.initialized
     * is false, doSomethingWith will be only be invoke once with the
     * initial value fo the data.
     * </li></ul></dd>
     * </dl>
     * @returns {Promise}
     * @example
     *    data.fetch().then(function(value) {
     *        return doSomethingWith(value);
     *    }
     */
    fetch: function() {
        return this._promise || promise.create(this.value);
    },
    /**
     * get the value of the data synchronously
     * @returns {exports.value|*}
     * @example
     *    var value = data.fetch();
     *    doSomethingWith(value);
     */
    fetchSync: function() {
        return this.value;
    },
    /**
     * update the value of the data with newest value.
     * @param value {*}
     * @param process {Function|undefined}
     * @returns {exports}
     */
    update: function(value, process) {
        var previous = this.value;
        var current = previous;

        if (_.isFunction(process)) {
            current = process(previous, value);
        } else if (previous && _.isPlainObject(previous)) {
            current = _.assign({}, previous, value);
        } else {
            current = value;
        }

        //in case of nothing updated actually.
        if (_.isEqual(current, previous)) {
            return this;
        }
        this.value = current;

        if (eventemitter.isPrototypeOf(this._emitter)) {
            this._emitter.emit(this._event, {
                previous: previous,
                current: current,
                differential: value
            });
        }

        return this;
    },
    /**
     *
     * @param value
     *    the initial value of the data
     * @param monitor
     *    the config object to tell whether should attach a listener to
     *    the emitter to listen to the initialization or update event of
     *    the value of the data.
     *    e.g.
     *      {
     *        updated: {boolean}, true for listening to update event
     *        initialized: {boolean}, true for listening to initialization
     *        deleted: {boolean}, true for listening to deleted event
     *      }
     * @param emitter
     *    the eventEmitter which listeners would be attached to.
     *    if nothing to pass to the emitter parameter, an internal eventEmitter
     *    would be created.
     * @param event
     *    the name of the update or initialization event.
     */
    init: function(value, monitor, emitter, event) {
        monitor = configMonitor(monitor);
        event = event || DEFAULT_EVENT;
        emitter = eventemitter.isPrototypeOf(emitter) ? emitter : eventemitter.create();
        value = value === null ? {} : value;

        this.value = value;
//        this.type = _.isArray(value)
//            ? 'array'
//            : _.isObject(value)
//                ? 'object'
//                : 'primitive'
//        ;

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
                this._promise = null;
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