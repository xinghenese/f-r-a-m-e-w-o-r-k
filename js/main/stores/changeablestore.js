/**
 * Created by kevin on 7/20/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var EventEmitter = require('../utils/eventemitter');

// private fields
var CHANGE_EVENT = "change";
var prefix = "changeable-store-";
var index = 0;

// exports
var ChangeableStore = EventEmitter.extend({
    _pendingEmission: false,
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    emitChange: function() {
        if (this._pendingEmission) {
            return;
        } else {
            this._pendingEmission = true;
        }

        _.defer(_.bind(function() {
            this._pendingEmission = false;
            this.emit(CHANGE_EVENT);
        }, this));
    },
    removeAllChangeListener: function() {
        this.removeAllListeners(CHANGE_EVENT);
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    toString: function() {
        if (!this._storeId) {
            this._storeId = prefix + index++;
        }
        return this._storeId;
    }
});

module.exports = ChangeableStore;
