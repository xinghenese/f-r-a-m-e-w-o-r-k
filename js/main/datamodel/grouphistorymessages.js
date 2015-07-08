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

// private fields


// exports
function GroupHistoryMessages(data) {
    this._data = data;
}

module.exports = GroupHistoryMessages;

// module initialization
GroupHistoryMessages.prototype.getGroupId = function() {
    return this._data["rid"];
};

GroupHistoryMessages.prototype.getUnreadMessageCount = function() {
    return this._data["urc"];
};

GroupHistoryMessages.prototype.noMoreMessages = function() {
    return objects.getBool(this._data["ise"]);
};

GroupHistoryMessages.prototype.getDirection = function() {
    return this._data["etp"];
};

// private functions