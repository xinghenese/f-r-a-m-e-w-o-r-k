/**
 * Created by Administrator on 2015/8/19.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');

var KeyInfo = require('../keyinfo');
var groups = require('../groups');
var Group = require('../group');
var users = require('../users');
var User = require('../user');
var MessageTypes = require('../../constants/messageconstants').MessageTypes;

var objects = require('../../utils/objects');
var Lang = require('../../locales/zh-cn');
var MessageConstants = require('../../constants/messageconstants');
var strings = require('../../utils/strings');

// private fields
var STRING_NOT_SET = KeyInfo.STRING_NOT_SET;
var NUMBER_NOT_SET = KeyInfo.NUMBER_NOT_SET;

var keyMap = {
    group: new KeyInfo('msrid', Number),
    user: new KeyInfo('msuid', Number),
    targetUser: new KeyInfo('mstuid', Number),
    atUser: new KeyInfo('atuid', Number),
    uuid: new KeyInfo('uuid', String),
    roomType: new KeyInfo('rmtp', Number),
    version: new KeyInfo('ver', String),
    minVersion: new KeyInfo('minver', String),
    alternate: new KeyInfo('alt', String),
    cursor: new KeyInfo('mscs', Number),
    timestamp: new KeyInfo('tmstp', Number),
    time: new KeyInfo('time', Date),
    status: new KeyInfo('status', Number),
    content: new KeyInfo('msg', Object),
    type: new KeyInfo('msgtp', Number)
};

// exports
function Message(data) {
    _.forEach(keyMap, function(sourceKeyInfo, targetKey) {
        if (sourceKeyInfo instanceof KeyInfo) {
            var fieldType = sourceKeyInfo.fieldType;
            var sourceFieldName = sourceKeyInfo.fieldName;
            var defaultValue = sourceKeyInfo.defaultValue;
            var sourceValue = data[sourceFieldName];
            sourceValue = _.isUndefined(sourceValue) || _.isNaN(sourceValue) ? defaultValue : sourceValue;

            if (!fieldType) {
                this[targetKey] = sourceValue;
            } else if (_.isFunction(fieldType.create)) {
                this[targetKey] = fieldType.create(sourceValue);
            } else if (_.isFunction(fieldType)) {
                this[targetKey] = fieldType(sourceValue);
            }
        } else {
            this[targetKey] = data[sourceKeyInfo];
        }
    }, this);

    // adjustment
    var groupId = parseInt(this.group);
    this.group = groupId && groups.getGroup(groupId) || Group.emptyGroup;

    var userId = parseInt(this.user);
    this.user = userId ? users.getUser(userId) || new User({uid: data['msuid'], unk: data['unk']}) : User.emptyUser;

    var targetUserId = parseInt(this.targetUser);
    this.targetUser = targetUserId ? users.getUser(targetUserId) || new User({uid: data['mstuid']}) : User.emptyUser;

    var atUserId = parseInt(this.atUser);
    this.atUser = atUserId ? users.getUser(atUserId) || new User({uid: data['atuid']}) : User.emptyUser;

    // backwards-compat with ../message.js
    this._data = data;
    _.assign(this.content, {toString: _.bind(function () { return this.getBriefText(); }, this)});
}

module.exports = Message;

// module initialization
_.assign(Message.prototype, {
    toElement: function() {
        var content = String(this.content);
        if (_.isObject(this.content)) {
            content = JSON.stringify(this.content);
        }
        return <span>{content}</span>;
    },
    dontCount: function() {
        return objects.getBool(this._data["dntcnt"]);
    },
    getGroupId: function() {
        return parseInt(this._data["msrid"] || -1);
    },
    getUserId: function() {
        return parseInt(this._data["msuid"] || -1);
    },
    getTargetUserIds: function() {
        return parseInt(this._data["mstuid"] || -1);
    },
    getAtUserId: function() {
        return parseInt(this._data["atuid"] || -1);
    },
    getContent: function() {
        if (this._data["msg"]) {
            return _.clone(this._data["msg"]);
        }
        return {
            type: parseInt(this._data['tp']) || 1,
            referobj: _.clone(this._data["referobj"])
        };
    },
    getBriefText: function() {
        var type = this.getMessageType();
        switch (type) {
            case 0:
                return this._data["msg"]["t"];
            case 1:
                return Lang.pictureMessage;
            case 2:
                return Lang.audioMessage;
            case 3:
                return Lang.locationMessage;
            case 4:
                return Lang.vibrationMessage;
            case MessageConstants.MessageTypes.SYSTEM:
                return _generateSystemMessageContent(this._data);
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
    },
    getUuid: function() {
        return this._data["uuid"];
    },
    getUserNickname: function() {
        return this._data["unk"];
    },
    getConversationType: function() {
        return this._data["rmtp"];
    },
    getMessageType: function() {
        return parseInt(this._data["msgtp"]);
    },
    getVersion: function() {
        return this._data["ver"];
    },
    getMinVersion: function() {
        return this._data["minver"];
    },
    getAltText: function() {
        return this._data["alt"];
    },
    getCursor: function() {
        return parseInt(this._data["mscs"]);
    },
    getTimestamp: function() {
        return parseInt(this._data["tmstp"]);
    },
    getStatus: function() {
        if (!objects.containsValuedProp(this, "_status")) {
            return MessageConstants.Status.UNKNOWN;
        }

        return this._status;
    },
    setStatus: function(status) {
        this._status = status;
    }
});

_.assign(Message, {
    formatContent: function(contentKeyMap) {
        var content = this.content;
        this.content = {};
        if (!content) {
            return;
        }
        _.forEach(contentKeyMap, function(sourceKeyInfo, targetKey) {
            if (sourceKeyInfo instanceof KeyInfo) {
                this.content[targetKey] = content[sourceKeyInfo.fieldName] || sourceKeyInfo.defaultValue;
            } else {
                this.content[targetKey] = content[sourceKeyInfo];
            }
        }, this);
    },
    create: function(data) {
        switch (parseInt(data['msgtp'])) {
            case MessageTypes.TEXT:
                return new (require('./textmessage'))(data);
            case MessageTypes.PICTURE:
                return new (require('./picturemessage'))(data);
            case MessageTypes.AUDIO:
                return new (require('./voicemessage'))(data);
            case MessageTypes.SYSTEM:
                return new (require('./systemmessage'))(data);
            default:
                return new Message(data);
        }
    }
});

// private function
/**
 * @see http://wiki.topcmm.net/doku.php?id=wiki:liao_enum#系统消息_tp
 * @param data TM message
 * @private
 */
function _generateSystemMessageContent(data) {
    var type = parseInt(data["tp"] || 1); // 1 for general system message
    switch (type) {
        case MessageConstants.SystemMessageTypes.INVITED_INTO_GROUP:
            var joinedNicknames = _generateJoinedNicknames(data);
            return strings.format(Lang.invitedIntoGroup, [data["unk"], joinedNicknames]);
        case MessageConstants.SystemMessageTypes.USER_INVITED_INTO_GROUP:
            var joinedNicknames = _generateJoinedNicknames(data);
            return strings.format(Lang.userInvitedIntoGroup, [joinedNicknames]);
        default:
            return Lang.systemMessage;
    }
}

function _generateJoinedNicknames(data) {
    var referedMembers = data["referobj"] || [];
    var membersWithoutInviter = _.filter(referedMembers, function(member) {
        return member["referid"] !== data["msuid"];
    });
    var nicknames = _.map(membersWithoutInviter, function(member) {
        return member["refern"];
    });
    return strings.join(nicknames, Lang.nicknameSeparator);
}
