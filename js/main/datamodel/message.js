/**
 * Created by kevin on 7/8/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var objects = require('../utils/objects');

// exports
function Message(data) {
    this._data = data;
}

module.exports = Message;

// module initialization
Message.prototype.getGroupId = function() {
    return this._data["msrid"];
};

Message.prototype.getUserId = function() {
    return this._data["msuid"];
};

Message.prototype.getTargetUserIds = function() {
    return this._data["mstuid"];
};

Message.prototype.getAtUserId = function() {
    return this._data["atuid"];
};

Message.prototype.getContent = function() {
    if (objects.hasHierarchicalProps(this._data, ["msg", "t"])) {
        return this._data["msg"]["t"];
    } else {
        // todo
        // generate content
        return "非文本消息";
    }
};

Message.prototype.getUuid = function() {
    return this._data["uuid"];
};

/**
 * Conversation type of string, 0 for group, 1 for private.
 */
Message.prototype.getConversationType = function() {
    return this._data["rmtp"];
};

/**
 * see http://wiki.topcmm.net/doku.php?id=wiki:liao_enum#msgtp
 */
Message.prototype.getMessageType = function() {
    return this._data["msgtp"];
};

Message.prototype.getVersion = function() {
    return this._data["ver"];
};

Message.prototype.getMinVersion = function() {
    return this._data["minver"];
};

Message.prototype.getAltText = function() {
    return this._data["alt"];
};
