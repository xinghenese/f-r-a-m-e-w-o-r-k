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
    },
    sendTalkMessage: function(groupId, toUserId, atUserId, content, conversationType, messageType, version) {
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
