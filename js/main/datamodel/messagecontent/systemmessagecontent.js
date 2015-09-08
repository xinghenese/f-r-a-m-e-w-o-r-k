/**
 * Created by Administrator on 2015/8/19.
 */
'use strict';

var _ = require('lodash');
var React = require('react');
var KeyInfo = require('../keyinfo');
var model = require('../model');
var Strings = require('../../utils/strings');
var Lang = require('../../locales/zh-cn');
var SystemMessageTypes = require('../../constants/messageconstants').SystemMessageTypes;

var refer = model.extend({
    keyMap: {
        entity: new KeyInfo(KeyInfo.arrayOf({userId: 'referid', userName: 'refern'}), Object)
    }
});

module.exports = model.extend({
    keyMap: {
        type:           new KeyInfo('type', Number),
        subtype:        new KeyInfo('tp', Number),
        refer:          new KeyInfo('refer', refer),
        userId:         new KeyInfo('uid', Number),
        userName:       new KeyInfo('unk', String),
        remarkName:     new KeyInfo('rmk', String)
    },
    toString: function () {
        return Lang.systemMessage;
    },
    toReactElement: function (props) {
        var text;
        switch (this.subtype) {
            case SystemMessageTypes.INVITED_INTO_GROUP:
                text = Strings.template(Lang.invitedIntoGroup, this.userName, _generateNicknames(this.refer, this.userId));
                break;
            case SystemMessageTypes.USER_INVITED_INTO_GROUP:
                text = Strings.template(Lang.userInvitedIntoGroup, _generateNicknames(this.refer, this.userId));
                break;
            case SystemMessageTypes.USER_KICKED_OUT_GROUP:
                text = Strings.template(Lang.userKickedOutGroup, _generateNicknames(this.refer, this.userId));
                break;
            case SystemMessageTypes.GROUP_NAME_CHANGED:
                text = Strings.format(Lang.groupNameChanged, this.userName, this.refer);
                break;
            case SystemMessageTypes.CONTACT_JOINED:
                text = Strings.format(Lang.contactJoined, this.remarkName);
                break;
            default :
                text = Lang.systemMessage;
        }
        return <p {...props}>{text}</p>;
    }
});

function _generateNicknames(message, userId) {
    return _.reduce(message.entity, function (memo, item) {
        if (!item.userId || !item.userName || item.userId == userId) {
            return memo;
        }
        memo.push(item.userName);
        return memo;
    }, []).join(Lang.nicknameSeparator);
}
