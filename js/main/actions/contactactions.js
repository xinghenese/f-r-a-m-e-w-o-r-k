/**
 * Created by kevin on 7/30/15.
 */
'use strict';

// dependencies
var ActionTypes = require('../constants/actiontypes');
var AppDispatcher = require('../dispatchers/appdispatcher');

// exports
module.exports = {
    getUserInfo: function (userId) {
        AppDispatcher.dispatch({
            type: ActionTypes.GET_USER_INFO,
            id: userId
        });
    }
};
