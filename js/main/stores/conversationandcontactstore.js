/**
 * Created by kevin on 7/30/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var ActionTypes = require('../constants/actiontypes');
var AppDispatcher = require('../dispatchers/appdispatcher');
var ChangeableStore = require('./changeablestore');
var ConversationConstants = require('../constants/conversationconstants');
var Group = require('../datamodel/group');
var HttpConnection = require('../net/connection/httpconnection');
var User = require('../datamodel/user');
var groups = require('../datamodel/groups');
var socketConnection = require('../net/connection/socketconnection');
var users = require('../datamodel/users');

// exports
var ConversationAndContactStore = ChangeableStore.extend({
    getGroupsAndContacts: function() {
        var groupArr = _.map(groups.getGroups(), function(item) {
            return {
                type: ConversationConstants.GROUP_TYPE,
                name: item.name(),
                id: item.getGroupId(),
                count: item.countOfMembers()
            };
        });
        var userArr = _.map(users.getUsers(), function(item) {
            return {
                type: ConversationConstants.PRIVATE_TYPE,
                name: item.nickname(),
                id: item.getUserId(),
                online: false, // todo
                lastActiveTime: 0
            }
        });
        return _.union(groupArr, userArr);
    }
});

module.exports = ConversationAndContactStore;

// module initialization
ConversationAndContactStore.dispatchToken = AppDispatcher.register(function (action) {
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
        data: {}
    }).then(function (response) {
        _processConversationListResponse(response);
        _processContactListResponse(response);
        ConversationAndContactStore.emitChange();
    }, function (error) {
        console.error(error);
    });
}

function _processConversationListResponse(response) {
    groups.setCursor(response.rl.cs);
    _.forEach(response.rl.l, function (n) {
        groups.addGroup(new Group(n));
    });
}

function _processContactListResponse(response) {
    users.setCursor(response.ul.cs);
    _.forEach(response.ul.l, function (n) {
        users.addUser(new User(n));
    });
}
