/**
 * Created by kevin on 7/16/15.
 *
 * TODO
 * we might need to take away the expired handlers on the condition of failed
 * to get the resposne forever.
 */
'use strict';

// dependencies
var _ = require('lodash');

// private fields

// exports
function HandlerBuffer() {
    this._data = {};
}

module.exports = HandlerBuffer;

// module initialization
HandlerBuffer.prototype.addHandler = function(tag, predicate, callback) {
    var handler = {
        predicate: predicate,
        callback: callback
    };
    if (tag in this._data) {
        this._data[tag].push(handler);
    } else {
        this._data[tag] = [handler];
    }
};

HandlerBuffer.prototype.hasMoreHandlers = function(tag) {
    return tag in this._data && !_.isEmpty(this._data[tag]);
};

HandlerBuffer.prototype.processData = function(tag, data) {
    if (!tag in this._data) {
        return;
    }

    var callbacks = _.remove(this._data[tag], function(handler) {
        return handler.predicate(data);
    });
    _.forEach(callbacks, function(callback) {
        callback(data);
    });
};

