/**
 * Created by kevin on 7/7/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var ActionTypes = require('../constants/actiontypes');
var AppDispatcher = require('../dispatchers/appdispatcher');
var EventEmitter = require('events').EventEmitter;
var Message = require('../datamodel/message');
var assign = require('object-assign');
var myself = require('../datamodel/myself');
var socketconnection = require('../net/connection/socketconnection');

// exports
var MessageStore = assign({}, EventEmitter.prototype, {
    Events: {
        HISTORY_MESSAGES_RECEIVED: "historyMessagesReceived",
        HISTORY_MESSAGES_MISSED: "historyMessagesMissed"
    }
});

module.exports = MessageStore;

// module initialization
MessageStore.dispatchToken = AppDispatcher.register(function(action) {
    switch (action.type) {
        case ActionTypes.REQUEST_HISTORY_MESSAGES:
            _handleHistoryMessagesRequest(action);
            break;
    }
});

// private functions
function _handleHistoryMessagesRequest(action) {
    socketconnection.request({
        tag: "HM",
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
        console.log(v);
    }, function(error) {
        MessageStore.emit(MessageStore.Events.HISTORY_MESSAGES_MISSED, error);
    });
}

function _handleHistoryMessagesResponse(response) {
    if (response.data.rmsg && response.data.rmsg.cvs && response.data.rmsg.cvs.length > 0) {
        _handleGroupHistoryMessages(response.data.rmsg.cvs);
    } else {
        console.log("no group history messages!");
    }
    console.log(2);
}

function _handleGroupHistoryMessages(messages) {
    console.log(3);
    var r = _.map(messages, function(v) {
        console.log(v);
        return new Message(v);
    });
    console.log(r);
}