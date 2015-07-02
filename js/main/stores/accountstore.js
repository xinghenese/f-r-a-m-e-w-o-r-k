'use strict';

var AppDispatcher = require('../dispatchers/appdispatcher');
var Constants = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var ActionTypes = Constants.ActionTypes;
var HttpConnection = require('../net/connection/httpconnection');
var objects = require('../utils/objects');
var Lang = require('../locales/zh-cn');
var UserAgent = require('../utils/useragent');
var Config = require('../etc/config');
var myself = require('../datamodel/myself');

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

//private fields
var _requestAccount = {
    code: "+86",
    phone: "",
    requestType: 1
};
var _myself = {};

var AccountStore = assign({}, EventEmitter.prototype, {
    Events: {
        CHECK_PHONE_STATUS_SUCCESS: 'checkPhoneStatusSuccess',
        CHECK_PHONE_STATUS_ERROR: 'checkPhoneStatusError',
        CHECK_VERIFICATION_CODE_SUCCESS: 'checkVerificationCodeSuccess',
        CHECK_VERIFICATION_CODE_FAILED: 'checkVerificationCodeFailed',
        REGISTER_SUCCESS: "registerSuccess",
        REGISTER_FAILED: "registerFailed",
        LOGIN_SUCCESS: 'loginSuccess',
        LOGIN_FAILED: 'loginFailed',
        LOGOUT_SUCCESS: 'logoutSuccess',
        LOGOUT_FAILED: 'logoutFailed',
        VERIFICATION_CODE_SENT: 'verificationCodeSent',
        VERIFICATION_CODE_NOT_SENT: 'verificationCodeNotSent'
    },
    getCode: function() {
        return _requestAccount.code;
    },
    getPhone: function() {
        return _requestAccount.phone;
    },
    getRequestType: function() {
        return _requestAccount.requestType;
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

function _handleLoginRequest(action) {
    console.log("device");
    console.log(Config.device);
    var data = {
        mid: action.phone,
        os: UserAgent.getOS(),
        di: UserAgent.getDeviceInfo(),
        dv: Config.device
    };
    // code is optional, default to 86
    if (objects.containsValuedProp(action, "code")) {
        data.cc = _removeLeadingPlusSignOfCode(action.code);
    }
    objects.copyValuedProp(action, "verificationCode", data, "c");
    objects.copyValuedProp(action, "password", data, "psw");
    HttpConnection.request({
        url: "usr/lg",
        data: data
    }).then(function(response) {
    }, function(error) {
        AccountStore.emit(AccountStore.Events.LOGIN_FAILED, Lang.loginFailed);
    });
}

function _handleLoginSuccess(response) {
    objects.copyValuedProp(response, "uid", myself, "uid");
    objects.copyValuedProp(response, "nn", myself, "nickname");
    objects.copyValuedProp(response, "pt", myself, "avatar");
    objects.setTruePropIf(myself, "hasPassword", response.hp === "1");
    objects.setTruePropIf(myself, "autoPlayDynamicEmotion", response.eape === "1");
    objects.setTruePropIf(myself, "autoPlayPrivateDynamicEmotion", response.epape === "1");
    objects.setTruePropIf(myself, "autoPlayGroupDynamicEmotion", response.erape === "1");
    objects.copyValuedProp(response, "dnds", myself, "doNotDistrubStartTime");
    objects.copyValuedProp(response, "dnde", myself, "doNotDistrubEndTime");
    objects.copyValuedProp(response, "uid", myself, "uid");
    objects.copyValuedProp(response, "uid", myself, "uid");
}

function _handleLogoutRequest(action) {
    HttpConnection.request({
        url: "usr/lo"
    }).then(function(response) {
        switch (response.r) {
            case 0: // success
                AccountStore.emit(AccountStore.Events.LOGOUT_SUCCESS);
                break;
            default: // failed
                AccountStore.emit(AccountStore.Events.LOGOUT_FAILED);
                break;
        }
    }, function(error) {
        AccountStore.emit(AccountStore.Events.LOGOUT_FAILED);
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
                AccountStore.emit(AccountStore.Events.REGISTER_SUCCESS, _stripStatusCodeInResponse(response));
                break;
            case 1: // failure
                AccountStore.emit(AccountStore.Events.REGISTER_FAILED, Lang.registerFailed);
                break;
            case 5: // invalid arguments
                AccountStore.emit(AccountStore.Events.REGISTER_FAILED, Lang.registerFailed);
                break;
            case 2002: // invalid nickname
                AccountStore.emit(AccountStore.Events.REGISTER_FAILED, Lang.invalidNickname);
                break;
            case 2005: // invalid phone number
                AccountStore.emit(AccountStore.Events.REGISTER_FAILED, Lang.invalidPhone);
                break;
            case 2006: // invalid country code
                AccountStore.emit(AccountStore.Events.REGISTER_FAILED, Lang.invalidCountryCode);
                break;
            case 2009: // invalid verification code
                AccountStore.emit(AccountStore.Events.REGISTER_FAILED, Lang.invalidVerificationCode);
                break;
            default: // unknown error
                AccountStore.emit(AccountStore.Events.REGISTER_FAILED, Lang.registerFailed);
                break;
        }
    }, function(error) {
        AccountStore.emit(AccountStore.Events.REGISTER_FAILED, Lang.registerFailed);
    });
}

function _handleVerificationCodeRequest(action, successCallback, failureCallback) {
    _updateAccount(action);

    var code = _removeLeadingPlusSignOfCode(action.code);
    var data = {
        cc: code,
        mid: action.phone,
        tp: action.requestType,
        mt: action.codeType
    };
    HttpConnection.request({
        url: "sms/sc",
        data: data
    }).then(function(response) {
        AccountStore.emit(AccountStore.Events.VERIFICATION_CODE_SENT);
    }, function(error) {
        switch (error) {
            case 1: // failed
            case 5: // invalid arguments
            case 102: // too many requests within 24 hours
            case 103: // send sms too often
            case 2001: // user not exist
            case 2005: // invalid phone number
            case 2007: // user deleted
            case 2012: // user already exist
            default:
                console.log(error);
                break;
        }
        AccountStore.emit(AccountStore.Events.VERIFICATION_CODE_NOT_SENT, Lang.requestVerificationCodeFailed);
    });
}

function _updateAccount(action) {
    _requestAccount.code = action.code;
    _requestAccount.phone = action.phone;
    _requestAccount.requestType = action.requestType;
}

AccountStore.dispatchToken = AppDispatcher.register(function(action) {
    switch (action.type) {
        case ActionTypes.LOGIN:
            _handleLoginRequest(action);
            break;
        case ActionTypes.REGISTER:
            _handleRegisterRequest(action);
            break;
        case ActionTypes.REQUEST_VERIFICATION_CODE:
            _handleVerificationCodeRequest(action);
            break;
    }
});

module.exports = AccountStore;
