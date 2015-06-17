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
var CHECK_VERIFICATION_CODE_SUCCESS = 'checkVerificationCodeSuccess';
var CHECK_VERIFICATION_CODE_FAILED = 'checkVerificationCodeFailed';
var REGISTER_SUCCESS = "registerSuccess";
var REGISTER_FAILED = "registerFailed";
var LOGIN_SUCCESS = 'loginSuccess';
var LOGIN_FAILED = 'loginFailed';
var LOGOUT_SUCCESS = 'logoutSuccess';
var LOGOUT_FAILED = 'logoutFailed';
var VERIFICATION_CODE_SENT = 'verificationCodeSent';
var VERIFICATION_CODE_NOT_SENT = 'verificationCodeNotSent';
var VOICE_VERIFICATION_CODE_SENT = 'voiceVerificationCodeSent';
var VOICE_VERIFICATION_CODE_NOT_SENT = 'voiceVerificationCodeNotSent';

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
    addCheckVerificationCodeSuccessListener: function(callback) {
        this.on(CHECK_VERIFICATION_CODE_SUCCESS, callback);
    },
    removeCheckVerificationCodeSuccessListener: function(callback) {
        this.removeListener(CHECK_VERIFICATION_CODE_SUCCESS, callback);
    },
    emitCheckVerificationCodeSuccess: function() {
        this.on(CHECK_VERIFICATION_CODE_SUCCESS);
    },
    addCheckVerificationCodeFailedListener: function(callback) {
        this.on(CHECK_VERIFICATION_CODE_FAILED, callback);
    },
    removeCheckVerificationCodeFailedListener: function(callback) {
        this.removeListener(CHECK_VERIFICATION_CODE_FAILED, callback);
    },
    emitCheckVerificationCodeFailed: function() {
        this.on(CHECK_VERIFICATION_CODE_FAILED);
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
    addLogoutSuccessListener: function(callback) {
        this.on(LOGOUT_SUCCESS, callback);
    },
    removeLogoutSuccessListener: function(callback) {
        this.removeListener(LOGOUT_SUCCESS, callback);
    },
    emitLogoutSuccess: function() {
        this.on(LOGOUT_SUCCESS);
    },
    addLogoutFailedListener: function(callback) {
        this.on(LOGIN_FAILED, callback);
    },
    removeLogoutFailedListener: function(callback) {
        this.removeListener(LOGIN_FAILED, callback);
    },
    emitLogoutFailed: function() {
        this.on(LOGIN_FAILED);
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
    },
    addVerificationCodeSentListener: function(callback) {
        this.on(VERIFICATION_CODE_SENT, callback);
    },
    removeVerificationCodeSentListener: function(callback) {
        this.removeListener(VERIFICATION_CODE_SENT, callback);
    },
    emitVerificationCodeSent: function() {
        this.on(VERIFICATION_CODE_SENT);
    },
    addVerificationCodeNotSentListener: function(callback) {
        this.on(VERIFICATION_CODE_NOT_SENT, callback);
    },
    removeVerificationCodeNotSentListener: function(callback) {
        this.removeListener(VERIFICATION_CODE_NOT_SENT, callback);
    },
    emitVerificationCodeNotSent: function(error) {
        this.on(VERIFICATION_CODE_NOT_SENT, error);
    },
    addVoiceVerificationCodeSentListener: function(callback) {
        this.on(VOICE_VERIFICATION_CODE_SENT, callback);
    },
    removeVoiceVerificationCodeSentListener: function(callback) {
        this.removeListener(VOICE_VERIFICATION_CODE_SENT, callback);
    },
    emitVoiceVerificationCodeSent: function() {
        this.on(VOICE_VERIFICATION_CODE_SENT);
    },
    addVoiceVerificationCodeNotSentListener: function(callback) {
        this.on(VOICE_VERIFICATION_CODE_NOT_SENT, callback);
    },
    removeVoiceVerificationCodeNotSentListener: function(callback) {
        this.removeListener(VOICE_VERIFICATION_CODE_NOT_SENT, callback);
    },
    emitVoiceVerificationCodeNotSent: function(error) {
        this.on(VOICE_VERIFICATION_CODE_NOT_SENT, error);
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

function _handleCheckVerificationCodeRequest(action) {
    var code = _removeLeadingPlusSignOfCode(action.code);
    var data = {
        cc: code,
        mid: action.phone,
        tp: action.verificationType,
        c: action.verificationCode
    };
    HttpConnection.request({
        url: "sms/cc",
        data: data
    }).then(function(response) {
        switch (response.r) {
            case 0: // success
                AccountStore.emitCheckVerificationCodeSuccess();
                break;
            default: // failed
                AccountStore.emitCheckVerificationCodeFailed();
                break;
        }
    }, function(error) {
        AccountStore.emitCheckVerificationCodeFailed();
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
                AccountStore.emitLoginFailed(Lang.loginFailed);
                break;
        }
    }, function(error) {
        AccountStore.emitLoginFailed(Lang.loginFailed);
    });
}

function _handleLogoutRequest(action) {
    HttpConnection.request({
        url: "usr/lo"
    }).then(function(response) {
        switch (response.r) {
            case 0: // success
                AccountStore.emitLogoutSuccess();
                break;
            default: // failed
                AccountStore.emitLogoutFailed();
                break;
        }
    }, function(error) {
        AccountStore.emitLogoutFailed();
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

function _handleVerificationRequest(action, url, successCallback, failureCallback) {
    var code = _removeLeadingPlusSignOfCode(action.code);
    var data = {
        mid: action.phone,
        cc: code,
        tp: action.verificationType
    };
    HttpConnection.request({
        url: url,
        data: data
    }).then(function(response) {
        switch (response.r) {
            case 0: // success
                successCallback();
                break;
            case 1: // failed
            case 5: // invalid arguments
            case 102: // too many requests within 24 hours
            case 103: // send sms too often
            case 2001: // user not exist
            case 2005: // invalid phone number
            case 2007: // user deleted
            case 2012: // user already exist
            default:
                failureCallback(Lang.requestVerificationCodeFailed);
                break;
        }
    }, function(error) {
        failureCallback(Lang.requestVerificationCodeFailed);
    });
}

function _handleVerificationCodeRequest(action) {
    _handleVerificationRequest(
        action,
        "sms/sc",
        AccountStore.emitVerificationCodeSent,
        AccountStore.emitVerificationCodeNotSent
    );
}

function _handleVoiceVerificationCodeRequest(action) {
    _handleVerificationRequest(
        action,
        "sms/svc",
        AccountStore.emitVoiceVerificationCodeSent,
        AccountStore.emitVoiceVerificationCodeNotSent
    );
}

AccountStore.dispatchToken = AppDispatcher.register(function(action) {
    switch (action.type) {
        case ActionTypes.CHECK_PHONE_STATUS:
            _handleCheckPhoneStatusRequest(action);
            break;
        case ActionTypes.LOGIN:
            _handleLoginRequest(action);
            break;
        case ActionTypes.REGISTER:
            _handleRegisterRequest(action);
            break;
        case ActionTypes.REQUEST_VERIFICATION_CODE:
            _handleVerificationCodeRequest(action);
            break;
        case ActionTypes.REQUEST_VOICE_VERIFICATION_CODE:
            _handleVoiceVerificationCodeRequest(action);
            break;
    }
});

module.exports = AccountStore;
