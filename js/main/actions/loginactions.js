'use strict';

var AppDispatcher = require('../dispatchers/appdispatcher');
var Constants = require('../constants/constants');
var ActionTypes = Constants.ActionTypes;

module.exports = {
    login: function(phone, code, password) {
        AppDispatcher.dispatch({
            actionType: ActionTypes.LOGIN,
            phone: phone,
            code: code,
            password: password
        });
    }
};
