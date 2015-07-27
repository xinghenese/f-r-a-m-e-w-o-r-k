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
var predicates = require('../utils/predicates');
var socketconnection = require('../net/connection/socketconnection');
var ChangeableStore = require('./changeablestore');
var Message = require('../datamodel/message');
var MessageConstants = require('../constants/messageconstants');

// exports
var MessageStore = ChangeableStore.extend({
    _groupHistoryMessages: {},
    _privateHistoryMessages: {},
    addGroupHistoryMessages: function(groupId, groupHistoryMessages) {
        this._groupHistoryMessages[groupId] = groupHistoryMessages;
    },
    addPrivateHistoryMessages: function(userId, privateHistoryMessages) {
        this._privateHistoryMessages[userId] = privateHistoryMessages;
    },
    appendGroupMessage: function(groupId, message) {
        if (groupId in this._groupHistoryMessages) {
            this._groupHistoryMessages[groupId].appendMessage(message);
        } else {
            var historyMessages = new GroupHistoryMessages({rid: groupId});
            this._groupHistoryMessages[groupId] = historyMessages;
        }

        this.emitChange();
    },
    appendPrivateMessage: function(userId, message) {
        if (userId in this._privateHistoryMessages) {
            this._privateHistoryMessages[userId].appendMessage(message);
        } else {
            var historyMessages = new PrivateHistoryMessages({uid: userId});
            this._privateHistoryMessages[userId] = historyMessages;
        }

        this.emitChange();
    },
    getGroupHistoryMessages: function(groupId) {
        return this._groupHistoryMessages[groupId];
    },
    getLastMessages: function() {
        return _collectLastMessages();
    },
    getPrivateHistoryMessages: function(userId) {
        return this._privateHistoryMessages[userId];
    }
});

module.exports = MessageStore;

// module initialization
MessageStore.dispatchToken = AppDispatcher.register(function(action) {
    switch (action.type) {
        case ActionTypes.DELETE_GROUP_MESSAGES:
            _handleDeleteGroupMessages(action.id);
            break;
        case ActionTypes.DELETE_PRIVATE_MESSAGES:
            _handleDeletePrivateMessages(action.id);
            break;
        case ActionTypes.REQUEST_HISTORY_MESSAGES:
            _handleHistoryMessagesRequest(action);
            break;
        case ActionTypes.SEND_TALK_MESSAGE:
            _handleSendTalkMessage(action);
            break;
    }
});

// private functions
function _appendMessage(data) {
    data["tmstp"] = new Date().valueOf();
    var message = new Message(data);

    if (objects.containsValuedProp(data, "msrid")) {
        MessageStore.appendGroupMessage(parseInt(data["msrid"]), message);
    } else {
        MessageStore.appendPrivateMessage(parseInt(data["mstuid"]), message);
    }

    return message;
}

function _appendMyMessage(data) {
    data["msuid"] = myself.uid;
    return _appendMessage(data);
}

function _collectLastMessages() {
    var messages = [];
    _.forEach(MessageStore._groupHistoryMessages, function(value, key) {
        if (!_.isEmpty(value)) {
            messages.push({
                groupId: key,
                message: _.last(value.getMessages())
            });
        }
    });
    _.forEach(MessageStore._privateHistoryMessages, function(value, key) {
        if (!_.isEmpty(value)) {
            messages.push({
                userId: key,
                message: _.last(value.getMessages())
            });
        }
    });
    return messages;
}

function _handleDeleteGroupMessages(id) {
    if (id in MessageStore._groupHistoryMessages) {
        delete MessageStore._groupHistoryMessages[id];
        MessageStore.emitChange();
    }
}

function _handleDeletePrivateMessages(id) {
    if (id in MessageStore._privateHistoryMessages) {
        delete MessageStore._privateHistoryMessages[id];
        MessageStore.emitChange();
    }
}

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
        MessageStore.emitChange();
    }, function(error) {
        MessageStore.emit(MessageStore.Events.HISTORY_MESSAGES_MISSED, error);
    });
}

function _handleSendTalkMessage(action) {
    var uuid = UuidGenerator.generate();
    var data = {
        msg: {
            t: action.content
        },
        rmtp: action.conversationType,
        msgtp: action.messageType,
        uuid: uuid
    };

    objects.copyValuedProp(action, "groupId", data, "msrid");
    objects.copyValuedProp(action, "toUserId", data, "mstuid");
    objects.copyValuedProp(action, "atUserId", data, "atuid");

    var message = _appendMyMessage(_.cloneDeep(data));
    socketconnection.request({
        tag: "TM",
        data: data,
        responseTag: "SCF",
        predicate: predicates.uuidPredicate(uuid)
    }).then(function(msg) {
        if (msg["uuid"] !== uuid) {
            console.log("wrong confirm, expect: " + uuid + ", actual: " + msg["uuid"]);
        } else {
            message.setStatus(MessageConstants.Status.RECEIVED);
            MessageStore.emitChange();
        }
    }).catch(function(error) {
        console.log("message sent failed: " + error);
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
        if (!_isValidGroup(v["rid"])) {
            return;
        }

        var groupHistoryMessages = new GroupHistoryMessages(v);
        MessageStore.addGroupHistoryMessages(groupHistoryMessages.getGroupId(), groupHistoryMessages);
    });
}

function _handlePrivateHistoryMessages(messages) {
    _.forEach(messages, function(v) {
        var privateHistoryMessages = new PrivateHistoryMessages(v);
        MessageStore.addPrivateHistoryMessages(privateHistoryMessages.getUserId(), privateHistoryMessages);
    });
}

function _isValidGroup(groupId) {
    return groupId && parseInt(groupId) > 0;
}
