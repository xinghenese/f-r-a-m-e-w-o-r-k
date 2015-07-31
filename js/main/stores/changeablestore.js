/**
 * Created by kevin on 7/20/15.
 */
'use strict';

// dependencies
var EventEmitter = require('../utils/eventemitter');

// private fields
var CHANGE_EVENT = "change";

// exports
var ChangeableStore = EventEmitter.extend({
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },
    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },
    removeAllChangeListener: function () {
        this.removeAllListeners(CHANGE_EVENT);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

module.exports = ChangeableStore;
