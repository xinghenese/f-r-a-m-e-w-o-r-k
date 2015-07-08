/**
 * Created by kevin on 7/6/15.
 */
'use strict';

// dependencies
var ActionTypes = require('../constants/actiontypes');
var AppDispatcher = require('../dispatchers/appdispatcher');

// exports
module.exports = {
    requestGroupMembers: function(groupId) {
        AppDispatcher.dispatch({
            type: ActionTypes.REQUEST_GROUP_MEMBERS,
            groupId: groupId
        });
    }
};
