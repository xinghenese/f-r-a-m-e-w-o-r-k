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
var SocketConnection = require('../net/connection/socketconnection');
var ChangeableStore = require('./changeablestore');
var User = require('../datamodel/user');
var assign = require('object-assign');
var myself = require('../datamodel/myself');
var groups = require('../datamodel/groups');
var objects = require('../utils/objects');
var users = require('../datamodel/users');

// private fields
var GROUP_LIST_REQUEST = 1;
var USER_LIST_REQUEST = 2;

var ConversationStore = ChangeableStore.extend({
    Events: {
        GROUPS_LOAD_SUCCESS: "groupsLoadSuccess",
        GROUPS_LOAD_FAILURE: "groupsLoadFailure",
        USERS_LOAD_SUCCESS: "usersLoadSuccess",
        USERS_LOAD_FAILURE: "usersLoadFailure"
    },
    _conversation: {
        type: null,
        id: -1
    },
    whichConversation: function() {
        return this._conversation;
    }
});

// exports
module.exports = ConversationStore;

// module initialization
ConversationStore.dispatchToken = AppDispatcher.register(function(action) {
    switch (action.type) {
        case ActionTypes.GET_CHAT_LIST:
            _handleGetChatListRequest(action);
            break;
        case ActionTypes.JOIN_CONVERSATION:
            _handleJoinConversationRequest(action);
            break;
        case ActionTypes.QUIT_CONVERSATION:
            _handleQuitConversationRequest(action);
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
                ConversationStore.emit(ConversationStore.Events.GROUPS_LOAD_SUCCESS);
                break;
            case USER_LIST_REQUEST:
                _processContactListResponse(response);
                ConversationStore.emit(ConversationStore.Events.USERS_LOAD_SUCCESS);
                break;
        }
    }, function(error) {
        switch (action.listType) {
            case GROUP_LIST_REQUEST:
                ConversationStore.emit(ConversationStore.Events.GROUPS_LOAD_FAILURE, error);
                break;
            case USER_LIST_REQUEST:
                ConversationStore.emit(ConversationStore.Events.USERS_LOAD_FAILURE, error);
                break;
        }
    });
}

function _handleJoinConversationRequest(action) {
    _quitCurrentConversation();

    var roomId = action.roomId;
    var userId = action.userId;
    var conversationType = action.conversationType;
    var data = {
        rmtp: conversationType
    };
    objects.copyValuedProp(action, "roomId", data, "msrid");
    objects.copyValuedProp(action, "userId", data, "mstuid");
    SocketConnection.request({
        tag: "ER",
        data: data,
        responseTag: "ER",
        predicate: function(msg) {
            if (conversationType !== parseInt(msg.rmtp)) {
                return false;
            } else if (!!roomId && roomId !== msg.msrid) {
                return false;
            } else if (!!userId && userId !== msg.mstuid) {
                return false;
            }
            return true;
        }
    }).then(function(msg) {
        var result = parseInt(msg.r);
        if (result === 0) {
            // joined conversation successfully
            // be aware of clients sent multiple ER, and got it in uncertain order
            var id = conversationType === 0 ? roomId : userId;
            ConversationStore._conversation = {
                type: conversationType,
                id: id
            };
        }
    });
}

function _handleQuitConversationRequest(action) {
    console.log("quit conversation");
    var roomId = action.roomId;
    var userId = action.userId;
    var conversationType = action.conversationType;
    var data = {
        rmtp: conversationType
    };
    objects.copyValuedProp(action, "roomId", data, "msrid");
    objects.copyValuedProp(action, "userId", data, "mstuid");
    SocketConnection.request({
        tag: "QR",
        data: data,
        responseTag: "QR",
        predicate: function(msg) {
            if (conversationType !== msg.rmtp) {
                return false;
            } else if (!!roomId && roomId !== msg.msrid) {
                return false;
            } else if (!!userId && userId !== msg.mstuid) {
                return false;
            }
            return true;
        }
    }).then(function(msg) {
        var result = parseInt(msg.r);
        var id = conversationType === 0 ? roomId : userId;
        if (result === 0) {
            if (ConversationStore._conversation.type === conversationType &&
                ConversationStore._conversation.id === id) {
                // quit conversation successfully
                ConversationStore._conversation = {
                    type: null,
                    id: -1
                };
            }
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

function _quitCurrentConversation() {
    var currentType = ConversationStore._conversation.type;
    var currentId = ConversationStore._conversation.id;
    if (currentId != -1) {
        _handleQuitConversationRequest({
            type: ActionTypes.QUIT_CONVERSATION,
            conversationType: currentType,
            roomId: currentType === 0 ? currentId : null,
            userId: currentType === 1 ? currentId : null
        });
    }
}