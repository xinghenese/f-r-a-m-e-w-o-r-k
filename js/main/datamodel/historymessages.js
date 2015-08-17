/**
 * Created by kevin on 8/14/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var Message = require('./message');

// exports
function HistoryMessages(data) {
    this._requested = false;
    this._data = data;
    this._messages = _parseMessages(this._data["tms"] || []).reverse();
}

module.exports = HistoryMessages;

// module initialization
HistoryMessages.prototype.addMessage = function(message) {
    if (_isNewerThanCurrentMessages(this._messages, message)) {
        this._messages.push(message);
    } else {
        // it works even if it returns -1 on no such message found
        var lastIndex = _.findLastIndex(this._messages, function(item) {
            return parseInt(item["mscs"]) < parseInt(message["mscs"]);
        });
        this._messages.splice(lastIndex + 1, 0, message);
    }
};

HistoryMessages.prototype.prependMessages = function(messages) {
    this._messages = messages.concat(this._messages);
};

HistoryMessages.prototype.getUnreadMessageCount = function() {
    return parseInt(this._data["urc"] || 0);
};

HistoryMessages.prototype.noMoreMessages = function() {
    return objects.getBool(this._data["ise"]);
};

HistoryMessages.prototype.getDirection = function() {
    var direction = this._data["etp"];
    return MessageConstants.parseMessageDirection(direction);
};

HistoryMessages.prototype.isDirectionChanged = function() {
    return "tp" in this._data;
};

HistoryMessages.prototype.getReadCursor = function() {
    return this._data["rcs"];
};

HistoryMessages.prototype.getCleanCursor = function() {
    return this._data["ccs"];
};

HistoryMessages.prototype.getMessages = function() {
    return this._messages;
};

HistoryMessages.prototype.isRequested = function() {
    return this._requested;
};

HistoryMessages.prototype.setRequested = function() {
    this._requested = true;
};

// private functions
function _parseMessages(arr) {
    return _.map(arr, function(v) {
        return new Message(v);
    });
}

function _isNewerThanCurrentMessages(messages, message) {
    if (_.isEmpty(messages)) {
        return true;
    }

    var last = _.last(messages);
    return parseInt(last.getCursor()) < parseInt(message.getCursor());
}
