'use strict';

var AppDispatcher = require('../dispatchers/appdispatcher');
var Constants = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var ActionTypes = Constants.ActionTypes;
var HttpConnection = require('../net/connection/httpconnection');
var objects = require('../utils/objects');
var Lang = require('../locales/zh-cn');

var DID_RECEIVE_PHONE_STATUS = 'didReceivePhoneStatus';
var CHECK_PHONE_STATUS_ERROR = 'checkPhoneStatusError';
var REGISTER_SUCCESS = "registerSuccess";
var REGISTER_FAILED = "registerFailed";
var LOGIN_SUCCESS = 'loginSuccess';
var LOGIN_FAILED = 'loginFailed';

var AccountStore = assign({}, EventEmitter.prototype, {
    addCheckPhoneStatusErrorListener: function(callback) {
        this.on(CHECK_PHONE_STATUS_ERROR, callback);
    },
    removeCheckPhoneStatusErrorListener: function(callback) {
        this.removeListener(CHECK_PHONE_STATUS_ERROR, callback);
    },
    emitCheckPhoneStatusError: function(error) {
        this.emit(CHECK_PHONE_STATUS_ERROR, error);
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
    addLoginSuccessListener: function(callback) {
        this.on(LOGIN_SUCCESS, callback);
    },
    removeLoginSuccessListener: function(callback) {
        this.removeListener(LOGIN_SUCCESS, callback);
    },
    emitLoginSuccess: function(response) {
        this.emit(LOGIN_SUCCESS, response);
    },
    addLoginFailedListener: function(callback) {
        this.on(LOGIN_FAILED, callback);
    },
    removeLoginFailedListener: function(callback) {
        this.removeListener(LOGIN_FAILED, callback);
    },
    emitLoginFailed: function(reason) {
        this.emit(LOGIN_FAILED, reason);
    },
    addRegisterSuccessListener: function(callback) {
        this.on(REGISTER_SUCCESS, callback);
    },
    removeRegisterSuccessListener: function(callback) {
        this.removeListener(REGISTER_SUCCESS, callback);
    },
    emitRegisterSuccess: function(data) {
        this.emit(REGISTER_SUCCESS, data);
    },
    addRegisterFailureListener: function(callback) {
        this.on(REGISTER_FAILED, callback);
    },
    removeRegisterFailureListener: function(callback) {
        this.removeListener(REGISTER_FAILED, callback);
    },
    emitRegisterFailure: function(error) {
        this.on(REGISTER_FAILED, error);
    }
});

function _removeLeadingPlusSignOfCode(code) {
    if (code.charAt(0) == '+') {
        return code.substring(1);
    }
    return code;
}

function _stripStatusCodeInResponse(response) {
    delete response.r;
    return response;
}

function _handleCheckPhoneStatusRequest(action) {
    var code = _removeLeadingPlusSignOfCode(action.code);
    HttpConnection.request({
        url: "usr/cm",
        data: {
            mid: action.phone,
            cc: code
        }
    }).then(function(status) {
        AccountStore.emitDidReceivePhoneStatus(status);
    }, function(error) {
        AccountStore.emitCheckPhoneStatusError(error);
    });
}

function _handleLoginRequest(action) {
    var data = {
        mid: action.phone,
        os: action.os,
        di: action.deviceInfo,
        dv: action.device
    };
    // code is optional, default to 86
    if (objects.containsValuedProp(action, "code")) {
        data.code = _removeLeadingPlusSignOfCode(action.code);
    }
    objects.copyValuedProp(action, "verificationCode", data, "c");
    objects.copyValuedProp(action, "password", data, "psw");
    HttpConnection.request({
        url: "usr/lg",
        data: data
    }).then(function(response) {
        switch (response.r) {
            case 0: // success
                AccountStore.emitLoginSuccess(_stripStatusCodeInResponse(response));
                break;
            case 2001: // user not exist
                AccountStore.emitLoginFailed(Lang.userNotExist);
                break;
            case 2005: // invalid phone number
                AccountStore.emitLoginFailed(Lang.invalidPhone);
                break;
            case 2009: // invalid verification code
                AccountStore.emitLoginFailed(Lang.invalidVerificationCode);
                break;
            case 2013: // wrong password
                AccountStore.emitLoginFailed(Lang.wrongPassword);
                break;
            default:
                ActionStore.emitLoginFailed(Lang.loginFailed);
                break;
        }
    }, function(error) {
        ActionStore.emitLoginFailed(Lang.loginFailed);
    });
}

function _handleRegisterRequest(action) {
    var code = _removeLeadingPlusSignOfCode(action.code);
    var data = {
        mid: action.phone,
        cc: code,
        nn: action.nickname,
        dv: action.device,
        di: action.deviceInfo,
        os: action.os
    };
    objects.copyValuedProp(action, "avatar", data, "pt");
    objects.copyValuedProp(action, "verificationCode", data, "c");
    HttpConnection.request({
        url: "usr/reg",
        data: data
    }).then(function(response) {
        switch (response.r) {
            case 0: // success
                AccountStore.emitRegisterSuccess(_stripStatusCodeInResponse(response));
                break;
            case 1: // failure
                AccountStore.emitRegisterFailure(Lang.registerFailed);
                break;
            case 5: // invalid arguments
                AccountStore.emitRegisterFailure(Lang.registerFailed);
                break;
            case 2002: // invalid nickname
                AccountStore.emitRegisterFailure(Lang.invalidNickname);
                break;
            case 2005: // invalid phone number
                AccountStore.emitRegisterFailure(Lang.invalidPhone);
                break;
            case 2006: // invalid country code
                AccountStore.emitRegisterFailure(Lang.invalidCountryCode);
                break;
            case 2009: // invalid verification code
                AccountStore.emitRegisterFailure(Lang.invalidVerificationCode);
                break;
            default: // unknown error
                AccountStore.emitRegisterFailure(Lang.registerFailed);
                break;
        }
    }, function(error) {
        AccountStore.emitRegisterFailure(Lang.registerFailed);
    });
}

AccountStore.dispatchToken = AppDispatcher.register(function(action) {
    switch (action.type) {
        case ActionTypes.CHECK_PHONE_STATUS:
            _handleCheckPhoneStatusRequest(action);
            break;
        case ActionTypes.LOGIN:
            AccountStore.emitLoginSuccess();
            break;
        case ActionTypes.REGISTER:
            _handleRegisterRequest(action);
            break;
    }
});

module.exports = AccountStore;
