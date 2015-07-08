/**
 * Created by kevin on 6/30/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var ActionTypes = require('../constants/actiontypes');
var AppDispatcher = require('../dispatchers/appdispatcher');
var EventEmitter = require('events').EventEmitter;
var Group = require('../datamodel/group');
var HttpConnection = require('../net/connection/httpconnection');
var User = require('../datamodel/user');
var assign = require('object-assign');
var myself = require('../datamodel/myself');
var groups = require('../datamodel/groups');
var users = require('../datamodel/users');

// private fields
var GROUP_LIST_REQUEST = 1;
var USER_LIST_REQUEST = 2;

var ChatStore = assign({}, EventEmitter.prototype, {
    Events: {
        GROUPS_LOAD_SUCCESS: "groupsLoadSuccess",
        GROUPS_LOAD_FAILURE: "groupsLoadFailure",
        USERS_LOAD_SUCCESS: "usersLoadSuccess",
        USERS_LOAD_FAILURE: "usersLoadFailure"
    }
});

// exports
module.exports = ChatStore;

// module initialization
ChatStore.dispatchToken = AppDispatcher.register(function(action) {
    switch (action.type) {
        case ActionTypes.GET_CHAT_LIST:
            _handleGetChatListRequest(action);
            break;
    }
});

// private functions
function _handleGetChatListRequest(action) {
    HttpConnection.request({
        url: "cht/gcl",
        data: {
            tp: action.listType
        }
    }).then(function(response) {
        switch (action.listType) {
            case GROUP_LIST_REQUEST:
                _processGroupListResponse(response);
                ChatStore.emit(ChatStore.Events.GROUPS_LOAD_SUCCESS);
                break;
            case USER_LIST_REQUEST:
                _processContactListResponse(response);
                ChatStore.emit(ChatStore.Events.USERS_LOAD_SUCCESS);
                break;
        }
    }, function(error) {
        switch (action.listType) {
            case GROUP_LIST_REQUEST:
                ChatStore.emit(ChatStore.Events.GROUPS_LOAD_FAILURE, error);
                break;
            case USER_LIST_REQUEST:
                ChatStore.emit(ChatStore.Events.USERS_LOAD_FAILURE, error);
                break;
        }
    });
}

function _processGroupListResponse(response) {
    groups.setCursor(response.rl.cs);
    _.forEach(response.rl.l, function(n) {
        groups.addGroup(new Group(n));
    });
}

function _processContactListResponse(response) {
    users.setCursor(response.ul.cs);
    _.forEach(response.ul.l, function(n) {
        users.addUser(new User(n));
    });
}