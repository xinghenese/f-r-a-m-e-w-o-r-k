/**
 * Created by kevin on 7/9/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var objects = require('../utils/objects');
var MessageConstants = require('../constants/messageconstants');
var Message = require('./message');

// exports
function PrivateHistoryMessages(data) {
    this._data = data;
    this._messages = _parseMessages(this._data["tms"]);
}

module.exports = PrivateHistoryMessages;

// module initialization
PrivateHistoryMessages.prototype.getUserId = function() {
    return this._data["uid"];
};

PrivateHistoryMessages.prototype.getUnreadMessageCount = function() {
    return this._data["urc"];
};

PrivateHistoryMessages.prototype.noMoreMessages = function() {
    return objects.getBool(this._data["ise"]);
};

PrivateHistoryMessages.prototype.getDirection = function() {
    var direction = this._data["etp"];
    return MessageConstants.parseMessageDirection(direction);
};

PrivateHistoryMessages.prototype.isDirectionChanged = function() {
    return "tp" in this._data;
};

PrivateHistoryMessages.prototype.getReadCursor = function() {
    return this._data["rcs"];
};

PrivateHistoryMessages.prototype.getCleanCursor = function() {
    return this._data["ccs"];
};

PrivateHistoryMessages.prototype.getMessages = function() {
    return this._messages;
};

// private functions
function _parseMessages(arr) {
    return _.map(arr, function(v) {
        return new Message(v);
    });
}
