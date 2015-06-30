'use strict';

var AppDispatcher = require('../dispatchers/appdispatcher');
var Constants = require('../constants/constants');
var ActionTypes = Constants.ActionTypes;

module.exports = {
    checkPhoneStatus: function(code, phone) {
        AppDispatcher.dispatch({
            type: ActionTypes.CHECK_PHONE_STATUS,
            code: code,
            phone: phone
        });
    },
    checkVerificationCode: function(code, phone, verificationType, verificationCode) {
        AppDispatcher.dispatch({
            type: ActionTypes.CHECK_VERIFICATION_CODE,
            code: code,
            phone: phone,
            verificationType: verificationType,
            verificationCode: verificationCode
        });
    },
    login: function(code, phone, password) {
        AppDispatcher.dispatch({
            type: ActionTypes.LOGIN,
            code: code,
            phone: phone,
            password: password
        });
    },
    logout: function() {
        AppDispatcher.dispatch({
            type: ActionTypes.LOGOUT
        });
    },
    register: function(code, phone, nickname, device, deviceInfo, os, avatar, verificationCode) {
        AppDispatcher.dispatch({
            type: ActionTypes.REGISTER,
            code: code,
            phone: phone,
            device: device,
            deviceInfo: deviceInfo,
            os: os,
            avatar: avatar,
            verificationCode: verificationCode
        });
    },
    requestVerificationCode: function(code, phone, requestType, codeType) {
        AppDispatcher.dispatch({
            type: ActionTypes.REQUEST_VERIFICATION_CODE,
            code: code,
            phone: phone,
            requestType: requestType || 1, // register/login, by default
            codeType: codeType || 1 // text code, by default
        });
    }
};
