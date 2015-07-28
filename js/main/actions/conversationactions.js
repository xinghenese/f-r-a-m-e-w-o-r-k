/**
 * Created by kevin on 6/30/15.
 */
'use strict';

// dependencies
var ActionTypes = require('../constants/actiontypes');
var AppDispatcher = require('../dispatchers/appdispatcher');

// exports
module.exports = {
    /**
     * Join a conversation.
     *
     * @param conversationType 0 for group, 1 for private
     * @param roomId the id of the group
     * @param userId the id of the target user
     */
    joinConversation: function(conversationType, roomId, userId) {
        AppDispatcher.dispatch({
            type: ActionTypes.JOIN_CONVERSATION,
            conversationType: conversationType,
            roomId: roomId,
            userId: userId
        });
    },
    /**
     * Quit a conversation.
     *
     * @param conversationType 0 for group, 1 for private
     * @param roomId the id of the group
     * @param userId the id of the target user
     */
    quitConversation: function(conversationType, roomId, userId) {
        AppDispatcher.dispatch({
            type: ActionTypes.QUIT_CONVERSATION,
            conversationType: conversationType,
            roomId: roomId,
            userId: userId
        });
    },
    getChatList: function(listType) {
        AppDispatcher.dispatch({
            type: ActionTypes.GET_CHAT_LIST,
            listType: listType
        });
    }
};
