/**
 * Created by Administrator on 2015/8/19.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var KeyInfo = require('../keyinfo');
var model = require('../model');
var Strings = require('../../utils/strings');
var Lang = require('../../locales/zh-cn');
var SystemMessageTypes = require('../../constants/messageconstants').SystemMessageTypes;

// private fields
var refer = model.extend({
    keyMap: {
        entity: new KeyInfo(KeyInfo.arrayOf({uid: 'referid', unk: 'refern'}), Object)
    }
});

// exports
module.exports = model.extend({
    keyMap: {
        type:           new KeyInfo('type', Number),
        subtype:        new KeyInfo('tp', Number),
        refer:          new KeyInfo('refer', refer),
        userId:         new KeyInfo('uid', Number),
        userName:       new KeyInfo('unk', String)
    },
    toString: function () {
        return Lang.systemMessage;
    },
    toReactElement: function () {
        switch (this.subtype) {
            case SystemMessageTypes.INVITED_INTO_GROUP:
                return <p>{Strings.template(Lang.invitedIntoGroup, this.userName, _generateNicknames(message, this.MuserId))}</p>;
            case SystemMessageTypes.USER_INVITED_INTO_GROUP:
                return <p>{Strings.template(Lang.userInvitedIntoGroup, _generateNicknames(message, this.userId))}</p>;
            case SystemMessageTypes.USER_KICKED_OUT_GROUP:
                return <p>{Strings.template(Lang.userKickedOutGroup, _generateNicknames(message, this.userId))}</p>;
            case SystemMessageTypes.GROUP_NAME_CHANGED:
                return <p>{Strings.format(Lang.groupNameChanged, this.userName, message.referName)}</p>;
            case SystemMessageTypes.CONTACT_JOINED:
                return <p>{Strings.format(Lang.contactJoined, data.getRemarkName())}</p>;
            default :
                return <p>{Lang.systemMessage}</p>;
        }
    }
});

// module initialization


// private functions
function ReferInfo() {

}

function _generateNicknames(message, userId) {
    return _.reduce(message.referInfo, function (memo, item) {
        if (!item.referUserId || !item.referUserName || item.referUserId == userId) {
            return memo;
        }
        memo.push(item.referUserName);
        return memo;
    }, []).join(Lang.nicknameSeparator);
}
