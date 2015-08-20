/**
 * Created by kevin on 7/20/15.
 */
'use strict';

// dependencies
var EventEmitter = require('../utils/eventemitter');

// private fields
var CHANGE_EVENT = "change";
var prefix = "changeable-store-";
var index = 0;

// exports
var ChangeableStore = EventEmitter.extend({
    addChangeListener: function (callback) {
        console.info('[changeable.js] - addChangeListener: ', this.toString());
        this.on(CHANGE_EVENT, callback);
    },
    emitChange: function () {
        console.info('[changeable.js] - emitChange: ', this.toString());
        this.emit(CHANGE_EVENT);
    },
    removeAllChangeListener: function () {
        this.removeAllListeners(CHANGE_EVENT);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    toString: function () {
        if (!this._storeId) {
            this._storeId = prefix + index++;
        }
        return this._storeId;
    }
});

module.exports = ChangeableStore;
