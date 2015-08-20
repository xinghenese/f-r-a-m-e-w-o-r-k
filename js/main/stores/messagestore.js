/**
 * Created by kevin on 7/7/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var ActionTypes = require('../constants/actiontypes');
var AppDispatcher = require('../dispatchers/appdispatcher');
var EventEmitter = require('events').EventEmitter;
var EventTypes = require('../constants/eventtypes');
var Group = require('../datamodel/group');
var GroupHistoryMessages = require('../datamodel/grouphistorymessages');
var PrivateHistoryMessages = require('../datamodel/privatehistorymessages');
var User = require('../datamodel/user');
var UuidGenerator = require('../utils/uuidgenerator');
var assign = require('object-assign');
var globalEmitter = require('../events/globalemitter');
var groups = require('../datamodel/groups');
var myself = require('../datamodel/myself');
var objects = require('../utils/objects');
var predicates = require('../utils/predicates');
var socketConnection = require('../net/connection/socketconnection');
var users = require('../datamodel/users');
var ChangeableStore = require('./changeablestore');
var ConversationConstants = require('../constants/conversationconstants');
//var Message = require('../datamodel/message');
var Message = require('../datamodel/messages/message');
var MessageConstants = require('../constants/messageconstants');

// exports
var MessageStore = ChangeableStore.extend({
    _pendingGroupMessages: {},
    _groupHistoryMessages: {},
    _privateHistoryMessages: {},
    addGroupMessage: function(groupId, message) {
        if (groupId in this._groupHistoryMessages) {
            this._groupHistoryMessages[groupId].addMessage(message);
        } else {
            var historyMessages = GroupHistoryMessages.create({rid: groupId});
            historyMessages.addMessage(message);
            this._groupHistoryMessages[groupId] = historyMessages;
        }

        this.emitChange();
    },
    addGroupHistoryMessages: function(groupId, groupHistoryMessages) {
        this._groupHistoryMessages[groupId] = groupHistoryMessages;
    },
    addPrivateMessage: function(userId, message) {
        if (userId in this._privateHistoryMessages) {
            this._privateHistoryMessages[userId].addMessage(message);
        } else {
            var historyMessages = PrivateHistoryMessages.create({uid: userId});
            historyMessages.addMessage(message);
            this._privateHistoryMessages[userId] = historyMessages;
        }

        this.emitChange();
    },
    addPrivateHistoryMessages: function(userId, privateHistoryMessages) {
        this._privateHistoryMessages[userId] = privateHistoryMessages;
    },
    getGroupHistoryMessages: function(groupId) {
        return this._groupHistoryMessages[groupId];
    },
    getLastMessages: function() {
        return _collectLastMessages();
    },
    getPrivateHistoryMessages: function(userId) {
        return this._privateHistoryMessages[userId];
    },
    removeGroupConversation: function(groupId) {
        if (groupId in this._groupHistoryMessages) {
            delete this._groupHistoryMessages[groupId];
        }
    },
    removePrivateConversation: function(userId) {
        if (userId in this._privateHistoryMessages) {
            delete this._privateHistoryMessages[userId];
        }
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
        case ActionTypes.REQUEST_GROUP_HISTORY_MESSAGES:
            _handleGroupHistoryMessagesRequest(action);
            break;
        case ActionTypes.REQUEST_HISTORY_MESSAGES:
            _handleInitialHistoryMessagesRequest(action);
            break;
        case ActionTypes.REQUEST_PRIVATE_HISTORY_MESSAGES:
            _handlePrivateHistoryMessagesRequest(action);
            break;
        case ActionTypes.SEND_TALK_MESSAGE:
            _handleSendTalkMessage(action);
            break;
    }
});

socketConnection.monitor("TM").then(function(data) {
    _handleReceivedTalkMessage(data);
}).done();

socketConnection.monitor("RDLG").then(function(data) {
    var referId = parseInt(data["referid"]);
    var conversationType = parseInt(data["rmtp"]);
    switch (conversationType) {
        case ConversationConstants.GROUP_INT_TYPE:
            MessageStore.removeGroupConversation(referId);
            MessageStore.emitChange();
            break;
        case ConversationConstants.PRIVATE_INT_TYPE:
            MessageStore.removePrivateConversation(referId);
            MessageStore.emitChange();
            break;
        default:
            console.error("Unknown type of removed conversation - ", conversationType);
            break;
    }
}).done();

socketConnection.monitor("ICH").then(function(data) {
    var type = parseInt(data["tp"]);
    switch (type) {
        case 0:
            _doHistoryMessagesRequest({
                msich: {
                    cs: myself.cursor
                }
            });
            break;
        case 1:
            // fall through
        case 2:
            _doHistoryMessagesRequest({
                rich: {
                    cs: groups.getCursor()
                }
            });
            break;
        case 3:
            /* todo
            var groupId = parseInt(data["msrid"]);
            _doHistoryMessagesRequest({
                rmmich: {
                    ich: [{
                        rid: groupId,
                        cs: groups.getGroup(groupId).getMembersCursor()
                    }]
                }
            });
            */
            break;
        case 4:
            _doHistoryMessagesRequest({
                uich: {
                    cs: users.getCursor()
                }
            });
            break;
        default:
            console.error("Unknow ICH type: ", type);
            break;
    }
}).done();

// private functions
function _appendMessage(data) {
    data["mscs"] = data["tmstp"] = new Date().valueOf();
    //var message = new Message(data);
    var message = Message.create(data);

    if (objects.containsValuedProp(data, "msrid")) {
        MessageStore.addGroupMessage(parseInt(data["msrid"]), message);
    } else {
        MessageStore.addPrivateMessage(parseInt(data["mstuid"]), message);
    }

    return message;
}

function _appendMyMessage(data) {
    data["msuid"] = myself.uid;
    data["unk"] = myself.nickname;
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
    return _.sortBy(messages, function(item) {
        if (!item.message) {
            return 0;
        }
        return -item.message.getTimestamp();
    });
}

function _doHistoryMessagesRequest(data) {
    socketConnection.request({
        tag: "HM",
        responseTag: "HM",
        data: {
            data: data
        }
    }).then(function(response) {
        _handleHistoryMessagesResponse(response);
        MessageStore.emitChange();
    });
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

function _handleGroupHistoryMessagesRequest(action) {
    var groupHistoryMessages = MessageStore.getGroupHistoryMessages(action.groupId);
    if (!groupHistoryMessages || _.isEmpty(groupHistoryMessages.getMessages())) {
        return;
    }

    var first = _.first(groupHistoryMessages.getMessages());
    socketConnection.request({
        tag: "HM",
        responseTag: "HM",
        data: {
            data: {
                rmsg: {
                    cvstp: 1, // request history message of single group
                    cvs: [{
                        rid: action.groupId,
                        cs: first.getCursor(),
                        tp: 1 // from new to old
                    }]
                }
            }
        }
    }).then(function(response) {
        _handleHistoryMessagesResponse(response);
        _markGroupHistoryMessagesAsRequested(action.groupId);
        MessageStore.emitChange();
    });
}

function _handleInitialHistoryMessagesRequest(action) {
    _doHistoryMessagesRequest({
        rmsg: {},
        pmsg: {},
        msich: {
            cs: myself.cursor
        },
        rich: {
            cs: groups.getCursor()
        },
        uich: {
            cs: users.getCursor()
        },
        dmc: {}
    });
}

function _handlePrivateHistoryMessagesRequest(action) {
    var privateHistoryMessages = MessageStore.getPrivateHistoryMessages(action.userId);
    if (!privateHistoryMessages || _.isEmpty(privateHistoryMessages.getMessages())) {
        return;
    }

    var first = _.first(privateHistoryMessages.getMessages());
    socketConnection.request({
        tag: "HM",
        responseTag: "HM",
        data: {
            pmsg: {
                cvstp: 1, // request history messages of single user
                cvs: [{
                    uid: action.userId,
                    cs: first.getCursor(),
                    tp: 1
                }]
            }
        }
    }).then(function(response) {
        _handleHistoryMessagesResponse(response);
        _markPrivateHistoryMessagesAsRequested(action.userId);
        MessageStore.emitChange();
    });
}

/**
 * Handles group system messages.
 * @param data
 * @returns {boolean} true to prevent default behavior, not adding to history messages; false for otherwise.
 * @private
 */
function _handleReceivedGroupSystemMessage(data) {
    if (!("msgtp" in data && parseInt(data["msgtp"]) === MessageConstants.MessageTypes.SYSTEM && "tp" in data)) {
        return false;
    }

    //var message = new Message(data);
    var message = Message.create(data);
    var type = parseInt(data["tp"]);
    switch (type) {
        case MessageConstants.SystemMessageTypes.INVITED_INTO_GROUP:
            // fall through
        case MessageConstants.SystemMessageTypes.USER_INVITED_INTO_GROUP:
            if (message.getGroupId() in MessageStore._pendingGroupMessages) {
                MessageStore._pendingGroupMessages[message.getGroupId()].push(message);
            } else {
                MessageStore._pendingGroupMessages[message.getGroupId()] = [message];
            }
            return true;
        default:
            console.log("Unknown system message received: ", type);
            return false;
    }
}

function _handleReceivedTalkMessage(data) {
    //var message = new Message(data);
    var message = Message.create(data);
    if (objects.containsValuedProp(data, "msrid")) {
        var pending = _handleReceivedGroupSystemMessage(data);
        if (!pending) {
            MessageStore.addGroupMessage(message.getGroupId(), message);
        }
    } else if (objects.containsValuedProp(data, "msuid")) {
        MessageStore.addPrivateMessage(message.getUserId(), message);
    } else {
        console.error("Unknow type of talk message received");
    }
    MessageStore.emitChange();
    globalEmitter.emit(EventTypes.NEW_MESSAGE_RECEIVED, message);
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
    socketConnection.request({
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

function _handleRoomInfoChangedResponse(response) {
    if (response.data.rich.cs) {
        groups.setCursor(response.data.rich.cs);
    }

    if (response.data.rich.ich) {
        _.forEach(response.data.rich.ich, function(item) {
            var groupId = parseInt(item["rid"]);
            var group = new Group(item);
            groups.removeGroup(groupId);
            groups.addGroup(group);

            if (groupId in MessageStore._pendingGroupMessages) {
                _.forEach(MessageStore._pendingGroupMessages[groupId], function(message) {
                    MessageStore.addGroupMessage(groupId, message);
                });

                delete MessageStore._pendingGroupMessages[groupId];
                MessageStore.emitChange();
            }
        });
    }
}

function _handleContactInfoChangedResponse(response) {
    // todo
}

function _handleHistoryMessagesResponse(response) {
    if (response.data.rmsg && response.data.rmsg.cvs && response.data.rmsg.cvs.length > 0) {
        _handleGroupHistoryMessages(response.data.rmsg.cvs);
    }

    if (response.data.pmsg && response.data.pmsg.cvs && response.data.pmsg.cvs.length > 0) {
        _handlePrivateHistoryMessages(response.data.pmsg.cvs);
    }

    if (response.data.rich) {
        _handleRoomInfoChangedResponse(response);
    }

    if (response.data.uich) {
        _handleContactInfoChangedResponse(response);
    }

    // todo
    // dmc node not implemented
}

function _handleGroupHistoryMessages(messages) {
    _.forEach(messages, function(v) {
        if (!_isValidGroup(v["rid"])) {
            return;
        }

        var groupId = parseInt(v["rid"]);
        var groupHistoryMessages = MessageStore.getGroupHistoryMessages(groupId);
        if (groupHistoryMessages) {
            var previousMessages = _.map(v["tms"], function(item) {
                //return new Message(item);
                return Message.create(item);
            });
            groupHistoryMessages.prependMessages(previousMessages.reverse());
        } else {
            groupHistoryMessages = GroupHistoryMessages.create(v);
            MessageStore.addGroupHistoryMessages(groupHistoryMessages.getGroupId(), groupHistoryMessages);
        }

        if (_.isEmpty(v["tms"])) {
            groupHistoryMessages.setRequested();
        }
    });
}

function _handlePrivateHistoryMessages(messages) {
    _.forEach(messages, function(v) {
        if (!v["uid"]) {
            return;
        }

        var userId = parseInt(v["uid"]);
        var privateHistoryMessages = MessageStore.getPrivateHistoryMessages(userId);
        if (privateHistoryMessages) {
            var previousMessages = _.map(v["tms"], function(item) {
                //return new Message(item);
                return Message.create(item);
            });
            privateHistoryMessages.prependMessages(previousMessages.reverse());
        } else {
            privateHistoryMessages = PrivateHistoryMessages.create(v);
            MessageStore.addPrivateHistoryMessages(privateHistoryMessages.getUserId(), privateHistoryMessages);
        }

        if (_.isEmpty(v["tms"])) {
            privateHistoryMessages.setRequested();
        }
    });
}

function _isValidGroup(groupId) {
    return groupId && parseInt(groupId) > 0;
}

function _markGroupHistoryMessagesAsRequested(groupId) {
    var history = MessageStore.getGroupHistoryMessages(groupId);
    if (history) {
        history.setRequested();
    }
}

function _markHistoryMessagesOfNewlyCreatedGroupAsRequested(groupId) {
    var historyMessages = GroupHistoryMessages.create({rid: groupId});
    historyMessages.setRequested();
    MessageStore._groupHistoryMessages[groupId] = historyMessages;
}

function _markPrivateHistoryMessagesAsRequested(userId) {
    var history = MessageStore.getPrivateHistoryMessages(userId);
    if (history) {
        history.setRequested();
    }
}

function _maybeAddGroupFromSystemMessage(data) {
    if (!("msrid" in data)) {
        return;
    }

    var groupId = parseInt(data["msrid"]);
    var group = groups.getGroup(groupId);
    if (group) {
        return;
    }

    var referedMembers = data["referobj"] || [];
    var members = _.map(referedMembers, function(member) {
        return {
            uid: member["referid"],
            unk: member["refern"]
        };
    });
    group = new Group({
        rid: data["msrid"],
        jml: members
    });
    groups.addGroup(group);

    _markHistoryMessagesOfNewlyCreatedGroupAsRequested(groupId);
}
