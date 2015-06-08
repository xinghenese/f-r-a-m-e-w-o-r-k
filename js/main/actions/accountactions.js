define(function(require, exports, module) {
    'use strict';

    var AppDispatcher = require('../dispatchers/appdispatcher');
    var Constants = require('../constants/constants');
    var ActionTypes = Constants.ActionTypes;

    module.exports = {
        checkPhoneStatus: function(code, phone) {
            AppDispatcher.dispatch({
                actionType: ActionTypes.CHECK_PHONE_STATUS,
                code: code,
                phone: phone
            });
        },
        login: function(phone, code, password) {
            AppDispatcher.dispatch({
                actionType: ActionTypes.LOGIN,
                phone: phone,
                code: code,
                password: password
            });
        }
    };
});
