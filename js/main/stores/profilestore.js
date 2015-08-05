'use strict';

var ActionTypes = require('../constants/actiontypes');
var AppDispatcher = require('../dispatchers/appdispatcher');
var AccountStore = require('./accountstore');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var PROFILE_LOADED = 'profileLoaded';

var ProfileStore = assign({}, EventEmitter.prototype, {
    emitProfileLoaded: function () {
        this.emit(PROFILE_LOADED);
    },
    addProfileLoadedListener: function (callback) {
        this.on(PROFILE_LOADED, callback);
    },
    removeProfileLoadedListener: function (callback) {
        this.removeListener(PROFILE_LOADED, callback);
    }
});

ProfileStore.dispatchToken = AppDispatcher.register(function (action) {
    console.log("here");
    switch (action.actionType) {
        case ActionTypes.LOGIN:
            AppDispatcher.waitFor([AccountStore.dispatchToken]);
            ProfileStore.emitProfileLoaded();
    }
});

module.exports = ProfileStore;
