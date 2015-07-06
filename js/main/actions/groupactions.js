/**
 * Created by kevin on 7/6/15.
 */
'use strict';

// dependencies
var ActionTypes = require('../constants/constants').ActionTypes;
var AppDispatcher = require('../dispatchers/appdispatcher');
var GroupStore = require('../stores/groupstore');

// exports
module.exports = {
    requestGroupMembers: function(groupId) {
        AppDispatcher.dispatch({
            type: ActionTypes.REQUEST_GROUP_MEMBERS,
            groupId: groupId
        });
    }
};
