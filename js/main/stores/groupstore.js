/**
 * Created by kevin on 7/6/15.
 */
'use strict';

// dependencies
var ActionTypes = require('../constants/actiontypes');
var AppDispatcher = require('../dispatchers/appdispatcher');
var EventEmitter = require('events').EventEmitter;
var HttpConnection = require('../net/connection/httpconnection');
var assign = require('object-assign');
var groups = require('../datamodel/groups');

// exports
var GroupStore = assign({}, EventEmitter.prototype, {
    Events: {
        REQUEST_GROUP_MEMBERS_SUCCESS: "requestGroupMembersSuccess",
        REQUEST_GROUP_MEMBERS_FAILURE: "requestGroupMembersFailure"
    }
});

// module initialization
GroupStore.dispatchToken = AppDispatcher.register(function (action) {
    switch (action.type) {
        case ActionTypes.REQUEST_GROUP_MEMBERS:
            _handleGroupMembersRequest(action);
            break;
    }
});

// private functions
function _handleGroupMembersRequest(action) {
    var data = {
        rid: action.groupId
    };
    HttpConnection.request({
        url: "rmm/ml",
        data: data
    }).then(function (response) {
        _handleGroupMembersResponse(action.groupId, response);
        GroupStore.emit(GroupStore.Events.REQUEST_GROUP_MEMBERS_SUCCESS);
    }, function (error) {
        GroupStore.emit(GroupStore.Events.REQUEST_GROUP_MEMBERS_FAILURE, error);
    });
}

function _handleGroupMembersResponse(groupId, response) {
    var group = groups.getGroup(groupId);
    group.setMembersCursor(response.rmmcs);
    group.setMembers(response.ul);
}
