/**
 * Created by Administrator on 2015/8/19.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');

var KeyInfo = require('../keyinfo');
var groups = require('../groups');
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
    group:          new KeyInfo('msrid',    NUMBER_NOT_SET),
    user:           new KeyInfo('msuid',    NUMBER_NOT_SET),
    targetUser:     new KeyInfo('mstuid',   NUMBER_NOT_SET),
    atUser:         new KeyInfo('atuid',    NUMBER_NOT_SET),
    uuid:           new KeyInfo('uuid',     NUMBER_NOT_SET),
    roomType:       new KeyInfo('rmtp',     NUMBER_NOT_SET),
    version:        new KeyInfo('ver',      STRING_NOT_SET),
    minVersion:     new KeyInfo('minver',   STRING_NOT_SET),
    alternate:      new KeyInfo('alt',      STRING_NOT_SET),
    cursor:         new KeyInfo('mscs',     NUMBER_NOT_SET),
    timeStamp:      new KeyInfo('tmstp',    NUMBER_NOT_SET),
    status:         new KeyInfo('status',   NUMBER_NOT_SET),
    content:        new KeyInfo('msg',      STRING_NOT_SET),
    type:           new KeyInfo('msgtp')
};

// exports
function Message(data) {
    _.forEach(keyMap, function (sourceKeyInfo, targetKey) {
        if (sourceKeyInfo instanceof KeyInfo) {
            this[targetKey] = data[sourceKeyInfo.fieldName] || sourceKeyInfo.defaultValue;
        } else {
            this[targetKey] = data[sourceKeyInfo];
        }
    }, this);

    // adjustment
    var groupId = parseInt(this.group);
    this.group = groupId && groups.getGroup(groupId) || null;

    var userId = parseInt(this.user);
    this.user = userId ? users.getUser(userId) || new User({uid: data['msuid'], unk: data['unk']}) : null;

    var targetUserId = parseInt(this.targetUser);
    this.targetUser = targetUserId ? users.getUser(targetUserId) || new User({uid: data['mstuid']}) : null;

    var atUserId = parseInt(this.atUser);
    this.atUser = atUserId ? users.getUser(atUserId) || new User({uid: data['atuid']}) : null;

    // backwards-compat with ../message.js
    this._data = data;
}

module.exports = Message;

// module initalization
_.assign(Message.prototype, {
    toElement: function () {
        var content = String(this.content);
        if (_.isObject(this.content)) {
            content = JSON.stringify(this.content);
        }
        return <span>{content}</span>;
    }
    ,// backwards-compat with ../message.js
    getGroupId: function () {
        return parseInt(this._data["msrid"] || -1);
    },
    getUserId: function () {
        return parseInt(this._data["msuid"] || -1);
    },
    getTargetUserIds: function () {
        return parseInt(this._data["mstuid"] || -1);
    },
    getAtUserId: function () {
        return parseInt(this._data["atuid"] || -1);
    },
    getContent:  function () {
        if (this._data["msg"]) {
            return _.clone(this._data["msg"]);
        }
        return {
            type: parseInt(this._data['tp']) || 1,
            referobj: _.clone(this._data["referobj"])
        };
    },
    getBriefText:  function () {
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
    getUuid:  function () {
        return this._data["uuid"];
    },
    getUserNickname: function () {
        return this._data["unk"];
    },
    getConversationType: function () {
        return this._data["rmtp"];
    },
    getMessageType: function () {
        return parseInt(this._data["msgtp"]);
    },
    getVersion: function () {
        return this._data["ver"];
    },
    getMinVersion: function () {
        return this._data["minver"];
    },
    getAltText: function () {
        return this._data["alt"];
    },
    getCursor: function () {
        return parseInt(this._data["tmstp"]);
    },
    getTimestamp: function () {
        return parseInt(this._data["tmstp"]);
    },
    getStatus: function () {
        if (!objects.containsValuedProp(this, "_status")) {
            return MessageConstants.Status.UNKNOWN;
        }

        return this._status;
    },
    setStatus: function (status) {
        this._status = status;
    }
});

_.assign(Message, {
    formatContent: function (contentKeyMap) {
        var content = this.content;
        this.content = {};
        if (!content) {
            return;
        }
        _.forEach(contentKeyMap, function (sourceKeyInfo, targetKey) {
            if (sourceKeyInfo instanceof KeyInfo) {
                this.content[targetKey] = content[sourceKeyInfo.fieldName] || sourceKeyInfo.defaultValue;
            } else {
                this.content[targetKey] = content[sourceKeyInfo];
            }
        }, this);
    },
    create: function (data) {
        console.info('messageType: ', data['msgtp']);
        switch (parseInt(data['msgtp'])) {
            case MessageTypes.TEXT:
                console.info('TextMessage');
                return new (require('./textmessage'))(data);
            case MessageTypes.PICTURE:
                console.info('PictureMessage');
                return new (require('./picturemessage'))(data);
            case MessageTypes.AUDIO:
                console.info('VoiceMessage');
                return new (require('./voicemessage'))(data);
            case MessageTypes.SYSTEM:
                console.info('SystemMessage');
                return new (require('./systemmessage'))(data);
            default:
                console.info('Message');
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
    var membersWithoutInviter = _.filter(referedMembers, function (member) {
        return member["referid"] !== data["msuid"];
    });
    var nicknames = _.map(membersWithoutInviter, function (member) {
        return member["refern"];
    });
    return strings.join(nicknames, Lang.nicknameSeparator);
}
