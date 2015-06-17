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
    login: function(phone, code, password) {
        AppDispatcher.dispatch({
            type: ActionTypes.LOGIN,
            phone: phone,
            code: code,
            password: password
        });
    }
};
