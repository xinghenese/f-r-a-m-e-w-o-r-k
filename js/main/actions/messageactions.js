/**
 * Created by kevin on 7/8/15.
 */
'use strict';

// dependencies
var ActionTypes = require('../constants/actiontypes');
var AppDispatcher = require('../dispatchers/appdispatcher');

// exports
module.exports = {
    deleteGroupMessages: function (id) {
        AppDispatcher.dispatch({
            type: ActionTypes.DELETE_GROUP_MESSAGES,
            id: id
        });
    },
    deletePrivateMessages: function (id) {
        AppDispatcher.dispatch({
            type: ActionTypes.DELETE_PRIVATE_MESSAGES,
            id: id
        });
    },
    markGroupMessagesAsRead: function(groupId) {
        AppDispatcher.dispatch({
            type: ActionTypes.MARK_GROUP_MESSAGES_AS_READ,
            id: groupId
        });
    },
    markPrivateMessagesAsRead: function(userId) {
        AppDispatcher.dispatch({
            type: ActionTypes.MARK_PRIVATE_MESSAGES_AS_READ,
            id: userId
        });
    },
    requestGroupHistoryMessages: function(groupId) {
        AppDispatcher.dispatch({
            type: ActionTypes.REQUEST_GROUP_HISTORY_MESSAGES,
            groupId: groupId
        });
    },
    requestHistoryMessages: function () {
        AppDispatcher.dispatch({
            type: ActionTypes.REQUEST_HISTORY_MESSAGES
        });
    },
    requestPrivateHistoryMessages: function(userId) {
        AppDispatcher.dispatch({
            type: ActionTypes.REQUEST_PRIVATE_HISTORY_MESSAGES,
            userId: userId
        });
    },
    sendTalkMessage: function (groupId, toUserId, atUserId, content, conversationType, messageType, version) {
        AppDispatcher.dispatch({
            type: ActionTypes.SEND_TALK_MESSAGE,
            groupId: groupId,
            toUserId: toUserId,
            atUserId: atUserId,
            content: content,
            conversationType: conversationType,
            messageType: messageType,
            version: version
        });
    }
};
