/**
 * Created by kevin on 7/8/15.
 */
'use strict';

/**
 * @see http://wiki.topcmm.net/doku.php?id=wiki:httpobject#room_message_object
 * @type {exports|module.exports}
 * @private
 */

// dependencies
var _ = require('lodash');
var objects = require('../utils/objects');
var MessageConstants = require('../constants/messageconstants');
var Message = require('./message');

// exports
function GroupHistoryMessages(data) {
    this._data = data;
    this._messages = _parseMessages(this._data["tms"]);
}

module.exports = GroupHistoryMessages;

// module initialization
GroupHistoryMessages.prototype.appendMessage = function(message) {
    this._messages.push(message);
};

GroupHistoryMessages.prototype.getGroupId = function() {
    return parseInt(this._data["rid"]);
};

GroupHistoryMessages.prototype.getUnreadMessageCount = function() {
    return parseInt(this._data["urc"] || 0);
};

GroupHistoryMessages.prototype.noMoreMessages = function() {
    return objects.getBool(this._data["ise"]);
};

GroupHistoryMessages.prototype.getDirection = function() {
    var direction = this._data["etp"];
    return MessageConstants.parseMessageDirection(direction);
};

GroupHistoryMessages.prototype.isDirectionChanged = function() {
    return "tp" in this._data;
};

GroupHistoryMessages.prototype.getReadCursor = function() {
    return this._data["rcs"];
};

GroupHistoryMessages.prototype.getCleanCursor = function() {
    return this._data["ccs"];
};

GroupHistoryMessages.prototype.getMessages = function() {
    return this._messages;
};

// private functions
function _parseMessages(arr) {
    return _.map(arr, function(v) {
        return new Message(v);
    });
}