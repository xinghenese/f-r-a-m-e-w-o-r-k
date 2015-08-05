/**
 * Created by kevin on 7/30/15.
 */
'use strict';

// dependencies
var ActionTypes = require('../constants/actiontypes');
var AppDispatcher = require('../dispatchers/appdispatcher');

// exports
module.exports = {
    getConversationAndContactList: function () {
        AppDispatcher.dispatch({
            type: ActionTypes.GET_CHAT_LIST
        });
    }
};
