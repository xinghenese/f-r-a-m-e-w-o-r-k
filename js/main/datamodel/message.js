/**
 * Created by kevin on 7/8/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var objects = require('../utils/objects');
var Lang = require('../locales/zh-cn');
var MessageConstants = require('../constants/messageconstants');

// exports
function Message(data) {
    this._data = data;
}

module.exports = Message;

// module initialization
Message.prototype.getGroupId = function () {
    return parseInt(this._data["msrid"] || -1);
};

Message.prototype.getUserId = function () {
    return parseInt(this._data["msuid"] || -1);
};

Message.prototype.getTargetUserIds = function () {
    return parseInt(this._data["mstuid"] || -1);
};

Message.prototype.getAtUserId = function () {
    return parseInt(this._data["atuid"] || -1);
};

Message.prototype.getContent = function () {
    if (objects.hasHierarchicalProps(this._data, ["msg", "t"])) {
        return this._data["msg"]["t"];
    } else {
        return Lang.unknownMessage;
    }
};

Message.prototype.getBriefText = function () {
    var type = this.getMessageType();
    switch (type) {
        case 0:
            return this.getContent();
        case 1:
            return Lang.pictureMessage;
        case 2:
            return Lang.audioMessage;
        case 3:
            return Lang.locationMessage;
        case 4:
            return Lang.vibrationMessage;
        case 5:
            return Lang.systemMessage;
        case 6:
            return Lang.emotionMessage;
        case 7:
            return Lang.predefinedMessage;
        case 10:
            return Lang.contactMessage;
        case 11:
            return Lang.groupCardMessage;
        default:
            return Lang.unknownMessage;
    }
};

Message.prototype.getUuid = function () {
    return this._data["uuid"];
};

Message.prototype.getUserNickname = function () {
    return this._data["unk"];
};

/**
 * Conversation type of string, 0 for group, 1 for private.
 */
Message.prototype.getConversationType = function () {
    return this._data["rmtp"];
};

/**
 * see http://wiki.topcmm.net/doku.php?id=wiki:liao_enum#msgtp
 */
Message.prototype.getMessageType = function () {
    return parseInt(this._data["msgtp"]);
};

Message.prototype.getVersion = function () {
    return this._data["ver"];
};

Message.prototype.getMinVersion = function () {
    return this._data["minver"];
};

Message.prototype.getAltText = function () {
    return this._data["alt"];
};

Message.prototype.getCursor = function() {
    return this._data["mscs"];
}

Message.prototype.getTimestamp = function () {
    return parseInt(this._data["tmstp"]);
};

Message.prototype.getStatus = function () {
    if (!objects.containsValuedProp(this, "_status")) {
        return MessageConstants.Status.UNKNOWN;
    }

    return this._status;
};

Message.prototype.setStatus = function (status) {
    this._status = status;
};
