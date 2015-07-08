/**
 * Created by kevin on 7/8/15.
 */
'use strict';

// dependencies
var ActionTypes = require('../constants/actiontypes');
var AppDispatcher = require('../dispatchers/appdispatcher');

// exports
module.exports = {
    requestHistoryMessages: function() {
        AppDispatcher.dispatch({
            type: ActionTypes.REQUEST_HISTORY_MESSAGES
        });
    }
};
