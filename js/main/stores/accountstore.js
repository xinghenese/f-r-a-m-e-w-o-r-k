'use strict';

var ActionTypes = require('../constants/actiontypes');
var AppDispatcher = require('../dispatchers/appdispatcher');
var HttpConnection = require('../net/connection/httpconnection');
var SocketConnection = require('../net/connection/socketconnection');
var objects = require('../utils/objects');
var Lang = require('../locales/zh-cn');
var UserAgent = require('../utils/useragent');
var Config = require('../etc/config');
var ChangeableStore = require('./changeablestore');
var keyMirror = require('keymirror');
var myself = require('../datamodel/myself');
var userconfig = require('../net/userconfig/userconfig');

//private fields
var _requestAccount = {
    code: "+86",
    phone: "",
    requestType: 1
};

var VerificationCodeState = {
    NOT_SENT: 0,
    SENT: 1,
    SENT_FAILED: 2
};

var LoginState = {
    DEFAULT: 0,
    SUCCESS: 1,
    FAILED: 2
};

var AccountStore = ChangeableStore.extend({
    Events: {
        CHECK_PHONE_STATUS_SUCCESS: 'checkPhoneStatusSuccess',
        CHECK_PHONE_STATUS_ERROR: 'checkPhoneStatusError',
        CHECK_VERIFICATION_CODE_SUCCESS: 'checkVerificationCodeSuccess',
        CHECK_VERIFICATION_CODE_FAILED: 'checkVerificationCodeFailed',
        REGISTER_SUCCESS: "registerSuccess",
        REGISTER_FAILED: "registerFailed",
        LOGOUT_SUCCESS: 'logoutSuccess',
        LOGOUT_FAILED: 'logoutFailed'
    },
    _error: null,
    _verificationCodeState: VerificationCodeState.NOT_SENT,
    _loginState: LoginState.DEFAULT,
    getCode: function () {
        return _requestAccount.code;
    },
    getLoginState: function () {
        return this._loginState;
    },
    getPhone: function () {
        return _requestAccount.phone;
    },
    getRequestType: function () {
        return _requestAccount.requestType;
    },
    getVerificationCodeState: function () {
        return this._verificationCodeState;
    }
});

module.exports = AccountStore;

// module modifications
AccountStore.VerificationCodeState = VerificationCodeState;
AccountStore.LoginState = LoginState;

AccountStore.dispatchToken = AppDispatcher.register(function (action) {
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
        case ActionTypes.SWITCH_STATUS:
            _handleSwitchStatusRequest(action);
            break;
    }
});

// private functions
function _handleLoginRequest(action) {
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
    HttpConnection.login({
        url: "usr/lg",
        data: data
    }).then(function (response) {
        _handleLoginSuccess(response);
        _afterLogin();
        AccountStore._loginState = LoginState.SUCCESS;
        AccountStore.emitChange();
    }, function () {
        AccountStore._loginState = LoginState.FAILED;
        AccountStore.emitChange();
    });
}

function _afterLogin() {
    userconfig.setUid(myself.uid);
    userconfig.setToken(myself.token);
}

function _handleLoginSuccess(response) {
    objects.copyValuedProp(response, "uid", myself, "uid");
    objects.copyValuedProp(response, "unk", myself, "nickname");
    objects.copyValuedProp(response, "pt", myself, "avatar");
    objects.setTruePropIfNotZero(myself, "hasPassword", response.hp);
    objects.setTruePropIfNotZero(myself, "autoPlayDynamicEmotion", response.eape);
    objects.setTruePropIfNotZero(myself, "autoPlayPrivateDynamicEmotion", response.epape);
    objects.setTruePropIfNotZero(myself, "autoPlayGroupDynamicEmotion", response.erape);
    objects.setTruePropIfNotZero(myself, "autoLoadPicture", response.eapp);
    objects.setTruePropIfNotZero(myself, "autoLoadPrivatePicture", response.epapp);
    objects.setTruePropIfNotZero(myself, "autoLoadGroupPicture", response.erapp);
    objects.setTruePropIfNotZero(myself, "autoPlayAudio", response.eaps);
    objects.setTruePropIfNotZero(myself, "autoPlayPrivateAudio", response.epaps);
    objects.setTruePropIfNotZero(myself, "autoPlayGroupAudio", response.eraps);
    objects.setTruePropIfNotZero(myself, "autoSavePicture", response.easp);
    objects.setTruePropIfNotZero(myself, "autoSavePrivatePicture", response.epasp);
    objects.setTruePropIfNotZero(myself, "autoSaveGroupPicture", response.erasp);
    objects.setTruePropIfNotZero(myself, "enableNotification", response.en);
    objects.setTruePropIfNotZero(myself, "enableVibrationNotification", response.evn);
    objects.setTruePropIfNotZero(myself, "enableContactJoinedNotification", response.ecjn);
    objects.setTruePropIfNotZero(myself, "enablePrivateMessageNotification", response.epn);
    objects.setTruePropIfNotZero(myself, "enableGroupMessageNotification", response.ern);
    objects.copyValuedProp(response, "dnds", myself, "doNotDistrubStartTime");
    objects.copyValuedProp(response, "dnde", myself, "doNotDistrubEndTime");
    objects.copyValuedProp(response, "ups", myself, "userPrivateSettings");
    objects.copyValuedProp(response, "urs", myself, "userRoomSettings");
    objects.copyValuedProp(response, "tk", myself, "token");
    objects.copyValuedProp(response, "rtk", myself, "refreshToken");
    objects.copyValuedProp(response, "trt", myself, "tokenRefreshTime");
    objects.copyValuedProp(response, "ct", myself, "cursor");
    objects.copyValuedProp(response, "tdlg", myself, "topConversations");
}

function _handleLogoutRequest(action) {
    HttpConnection.request({
        url: "usr/lo"
    }).then(function (response) {
        switch (response.r) {
            case 0: // success
                AccountStore.emit(AccountStore.Events.LOGOUT_SUCCESS);
                break;
            default: // failed
                AccountStore.emit(AccountStore.Events.LOGOUT_FAILED);
                break;
        }
    }, function (error) {
        AccountStore.emit(AccountStore.Events.LOGOUT_FAILED);
    });
}

function _handleRegisterRequest(action) {
    var code = _removeLeadingPlusSignOfCode(action.code);
    var data = {
        mid: action.phone,
        cc: code,
        unk: action.nickname,
        dv: action.device,
        di: action.deviceInfo,
        os: action.os
    };
    objects.copyValuedProp(action, "avatar", data, "pt");
    objects.copyValuedProp(action, "verificationCode", data, "c");
    HttpConnection.request({
        url: "usr/reg",
        data: data
    }).then(function (response) {
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
    }, function () {
        AccountStore.emit(AccountStore.Events.REGISTER_FAILED, Lang.registerFailed);
    });
}

function _handleSwitchStatusRequest(action) {
    SocketConnection.request({
        tag: "SS",
        data: {
            tp: action.statusType
        }
    });
}

function _handleVerificationCodeRequest(action) {
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
    }).then(function () {
        AccountStore._verificationCodeState = VerificationCodeState.SENT;
        AccountStore.emitChange();
    }, function (error) {
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
        AccountStore._error = Lang.requestVerificationCodeFailed;
        AccountStore.emitChange();
    });
}

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

function _updateAccount(action) {
    _requestAccount.code = action.code;
    _requestAccount.phone = action.phone;
    _requestAccount.requestType = action.requestType;
}
