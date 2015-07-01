/**
 * Created by kevin on 6/30/15.
 */
'use strict';

// dependencies
var ActionTypes = require('../constants/constants').ActionTypes;
var AppDispatcher = require('../dispatchers/appdispatcher');

// exports
module.exports = {
    getChatList: function(listType) {
        AppDispatcher.dispatch({
            type: ActionTypes.GET_CHAT_LIST,
            listType: listType
        });
    }
};
