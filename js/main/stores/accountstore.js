'use strict';

var AppDispatcher = require('../dispatchers/appdispatcher');
var Constants = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var ActionTypes = Constants.ActionTypes;

var LOGIN_SUCCESS = 'loginSuccess';
var LOGIN_FAILED = 'loginFailed';

var AccountStore = assign({}, EventEmitter.prototype, {
    emitLoginSuccess: function() {
        this.emit(LOGIN_SUCCESS);
    },
    emitLoginFailed: function() {
        this.emit(LOGIN_FAILED);
    },
    addLoginSuccessListener: function(callback) {
        this.on(LOGIN_SUCCESS, callback);
    },
    removeLoginSuccessListener: function(callback) {
        this.removeListener(LOGIN_SUCCESS, callback);
    },
    addLoginFailedListener: function(callback) {
        this.on(LOGIN_FAILED, callback);
    },
    removeLoginFailedListener: function(callback) {
        this.removeListener(LOGIN_FAILED, callback);
    }
});

AccountStore.dispatchToken = AppDispatcher.register(function(action) {
    switch (action.actionType) {
        case ActionTypes.LOGIN:
            AccountStore.emitLoginSuccess();
            break;
    }
});

module.exports = AccountStore;
