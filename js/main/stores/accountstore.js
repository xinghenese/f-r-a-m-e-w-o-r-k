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

function _copyTruthyProp(src, srcAttr, dst, dstAttr) {
    if (objects.containsTruthy(src, srcAttr)) {
        dst[dstAttr] = src[srcAttr];
    }
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
    _copyTruthyProp(action, "avatar", data, "pt");
    _copyTruthyProp(action, "c", data, "verificationCode");
    HttpConnection.request({
        url: "usr/reg",
        data: data
    }).then(function(status) {
        switch (status.r) {
            case 0: // success
                delete status.r;
                AccountStore.emitRegisterSuccess(status);
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
