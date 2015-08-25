/**
 * Created by kevin on 8/14/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var Message = require('./messages/message');

// exports
function HistoryMessages(data) {
    this._requested = false;
    this._data = data;
    this._messages = _parseMessages(this._data["tms"] || []).reverse();
    this._totalUnreadCount = _computeTotalUnreadCount(this);
}

module.exports = HistoryMessages;

// module initialization
HistoryMessages.prototype.addMessage = function(message) {
    if (_isNewerThanCurrentMessages(this._messages, message)) {
        this._messages.push(message);
    } else {
        // it works even if it returns -1 on no such message found
        var lastIndex = _.findLastIndex(this._messages, function(item) {
            return item.getCursor() < message.getCursor();
        });
        this._messages.splice(lastIndex + 1, 0, message);
    }
    this._totalUnreadCount++;
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
    return parseInt(this._data["rcs"] || 0);
};

HistoryMessages.prototype.getCleanCursor = function() {
    return parseInt(this._data["ccs"] || 0);
};

HistoryMessages.prototype.getMessages = function() {
    return this._messages;
};

HistoryMessages.prototype.getTotalUnreadCount = function() {
    return this._totalUnreadCount;
};

HistoryMessages.prototype.isRequested = function() {
    return this._requested;
};

HistoryMessages.prototype.markAsRead = function() {
    var last = _.last(this.getMessages());
    if (last) {
        this._data["rcs"] = last.getCursor().toString();
    }
    this._totalUnreadCount = 0;
};

HistoryMessages.prototype.markAsReadBeforeCursor = function(cursor) {
    this._data["rcs"] = cursor.toString();
    var previousUnreadCount = this._totalUnreadCount;
    this._totalUnreadCount = _computeUnreadCountFromMessages(this, cursor);
    return previousUnreadCount != this._totalUnreadCount;
};

HistoryMessages.prototype.setRequested = function() {
    this._requested = true;
};

// private functions
function _parseMessages(arr) {
    return _.map(arr, function(v) {
        return Message.create(v);
    });
}

function _isNewerThanCurrentMessages(messages, message) {
    if (_.isEmpty(messages)) {
        return true;
    }

    var last = _.last(messages);
    return parseInt(last.getCursor()) < parseInt(message.getCursor());
}

function _computeTotalUnreadCount(historyMessages) {
    var lastMessage = _.last(historyMessages.getMessages());
    if (!lastMessage) {
        return 0;
    }

    var lastCursor = lastMessage.getCursor();
    var readCursor = historyMessages.getReadCursor();
    if (readCursor >= lastCursor) {
        return 0;
    }
    var count = _computeUnreadCountFromMessages(historyMessages, readCursor);
    var urc = historyMessages.getUnreadMessageCount();
    return count + urc;
}

function _computeUnreadCountFromMessages(historyMessages, readCursor) {
    var messages = historyMessages.getMessages();
    var len = messages.length;
    var count = 0;

    for (var i = len - 1; i >= 0; --i) {
        var message = messages[i];
        if (message.getCursor() <= readCursor) {
            break;
        }
        if (message.dontCount()) {
            continue;
        }
        ++count;
    }

    return count;
}
