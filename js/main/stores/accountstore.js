define(function(require, exports, module) {
    'use strict';

    var AppDispatcher = require('../dispatchers/appdispatcher');
    var Constants = require('../constants/constants');
    var EventEmitter = require('events').EventEmitter;
    var assign = require('object-assign');
    var ActionTypes = Constants.ActionTypes;
    var HttpConnection = require('../net/connection/httpconnection');

    var DID_RECEIVE_PHONE_STATUS = 'didReceivePhoneStatus';
    var CHECK_PHONE_STATUS_ERROR = 'checkPhoneStatusError';
    var LOGIN_SUCCESS = 'loginSuccess';
    var LOGIN_FAILED = 'loginFailed';

    var AccountStore = assign({}, EventEmitter.prototype, {
        addLoginSuccessListener: function(callback) {
            this.on(LOGIN_SUCCESS, callback);
        },
        removeLoginSuccessListener: function(callback) {
            this.removeListener(LOGIN_SUCCESS, callback);
        },
        emitLoginSuccess: function() {
            this.emit(LOGIN_SUCCESS);
        },
        addLoginFailedListener: function(callback) {
            this.on(LOGIN_FAILED, callback);
        },
        removeLoginFailedListener: function(callback) {
            this.removeListener(LOGIN_FAILED, callback);
        },
        emitLoginFailed: function() {
            this.emit(LOGIN_FAILED);
        },
        addDidReceivePhoneStatusListener: function(callback) {
            this.on(DID_RECEIVE_PHONE_STATUS, callback);
        },
        removeDidReceivePhoneStatusListener: function(callback) {
            this.removeListener(DID_RECEIVE_PHONE_STATUS, callback);
        },
        emitDidReceivePhoneStatus: function(status) {
            this.emit(DID_RECEIVE_PHONE_STATUS, status);
        },
        addCheckPhoneStatusErrorListener: function(callback) {
            this.on(CHECK_PHONE_STATUS_ERROR, callback);
        },
        removeCheckPhoneStatusErrorListener: function(callback) {
            this.removeListener(CHECK_PHONE_STATUS_ERROR, callback);
        },
        emitCheckPhoneStatusError: function(error) {
            this.emit(CHECK_PHONE_STATUS_ERROR, error);
        }
    });

    AccountStore.dispatchToken = AppDispatcher.register(function(action) {
        switch (action.actionType) {
            case ActionTypes.LOGIN:
                AccountStore.emitLoginSuccess();
                break;
            case ActionTypes.CHECK_PHONE_STATUS:
                var code = action.code;
                if (code.charAt(0) == '+') {
                    code = code.substring(1);
                }
                HttpConnection.request({
                    url: "usr/cm",
                    data: {
                        mid: action.phone,
                        cc: code
                    }
                }).catch(function(error) {
                    AccountStore.emitCheckPhoneStatusError(error);
                }).then(function(status) {
                    AccountStore.emitDidReceivePhoneStatus(status);
                });
                break;
        }
    });

    module.exports = AccountStore;
});
