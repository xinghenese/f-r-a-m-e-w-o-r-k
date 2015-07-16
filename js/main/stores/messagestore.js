/**
 * Created by kevin on 7/7/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var ActionTypes = require('../constants/actiontypes');
var AppDispatcher = require('../dispatchers/appdispatcher');
var EventEmitter = require('events').EventEmitter;
var GroupHistoryMessages = require('../datamodel/grouphistorymessages');
var PrivateHistoryMessages = require('../datamodel/privatehistorymessages');
var UuidGenerator = require('../utils/uuidgenerator');
var assign = require('object-assign');
var myself = require('../datamodel/myself');
var objects = require('../utils/objects');
var socketconnection = require('../net/connection/socketconnection');

// exports
var MessageStore = assign({}, EventEmitter.prototype, {
    Events: {
        HISTORY_MESSAGES_RECEIVED: "historyMessagesReceived",
        HISTORY_MESSAGES_MISSED: "historyMessagesMissed"
    },
    _groupHistoryMessages: {},
    _privateHistoryMessages: {},
    addGroupHistoryMessages: function(groupId, groupHistoryMessages) {
        this._groupHistoryMessages[groupId] = groupHistoryMessages;
    },
    addPrivateHistoryMessages: function(userId, privateHistoryMessages) {
        this._privateHistoryMessages[userId] = privateHistoryMessages;
    },
    getGroupHistoryMessages: function(groupId) {
        return this._groupHistoryMessages[groupId];
    },
    getPrivateHistoryMessages: function(userId) {
        return this._privateHistoryMessages[userId];
    }
});

module.exports = MessageStore;

// module initialization
MessageStore.dispatchToken = AppDispatcher.register(function(action) {
    switch (action.type) {
        case ActionTypes.REQUEST_HISTORY_MESSAGES:
            _handleHistoryMessagesRequest(action);
            break;
        case ActionTypes.SEND_TALK_MESSAGE:
            _handleSendTalkMessage(action);
            break;
    }
});

// private functions
function _handleHistoryMessagesRequest(action) {
    socketconnection.request({
        tag: "HM",
        responseTag: "HM",
        data: {
            data: {
                msich: {
                    cs: myself.cursor
                },
                rmsg: {},
                pmsg: {},
                dmc: {}
            }
        }
    }).then(function(response) {
        _handleHistoryMessagesResponse(response);
        MessageStore.emit(MessageStore.Events.HISTORY_MESSAGES_RECEIVED);
    }, function(error) {
        MessageStore.emit(MessageStore.Events.HISTORY_MESSAGES_MISSED, error);
    });
}

function _handleSendTalkMessage(action) {
    var data = {
        msg: {
            t: action.content
        },
        rmtp: action.conversationType,
        msgtp: action.messageType,
        uuid: UuidGenerator.generate()
    };
    objects.copyValuedProp(action, "groupId", data, "msrid");
    objects.copyValuedProp(action, "toUserId", data, "mstuid");
    objects.copyValuedProp(action, "atUserId", data, "atuid");
    socketconnection.request({
        tag: "TM",
        data: data
    }).catch(function() {
        console.log("message sent failed");
    });
}

function _handleHistoryMessagesResponse(response) {
    if (response.data.rmsg && response.data.rmsg.cvs && response.data.rmsg.cvs.length > 0) {
        _handleGroupHistoryMessages(response.data.rmsg.cvs);
    } else {
        console.log("no group history messages!");
    }

    if (response.data.pmsg && response.data.pmsg.cvs && response.data.pmsg.cvs.length > 0) {
        _handlePrivateHistoryMessages(response.data.pmsg.cvs);
    } else {
        console.log("no private history messages!");
    }

    // todo
    // dmc node not implemented
}

function _handleGroupHistoryMessages(messages) {
    _.forEach(messages, function(v) {
        var groupHistoryMessages = new GroupHistoryMessages(v);
        MessageStore.addGroupHistoryMessages(groupHistoryMessages.getGroupId(), groupHistoryMessages);
    });
}

function _handlePrivateHistoryMessages(messages) {
    _.forEach(messages, function(v) {
        var privateHistoryMessages = new PrivateHistoryMessages(v);
        MessageStore.addPrivateHistoryMessages(privateHistoryMessages.getUserId(), privateHistoryMessages);
    })
}