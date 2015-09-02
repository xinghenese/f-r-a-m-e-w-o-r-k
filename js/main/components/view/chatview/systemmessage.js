/**
 * Created by Administrator on 2015/8/27.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var MessageConstants = require('../../../constants/messageconstants');
var SystemMessageTypes = MessageConstants.SystemMessageTypes;
var Strings = require('../../../utils/strings');
var Lang = require('../../../locales/zh-cn');

// private fields


// exports
module.exports = React.createClass({
    displayName: 'SystemMessage',
    render: function () {
        var data = this.props.data;
        var message = data && data.content;
        var userId = data && data.user.getUserId();
        var userName = data && data.user.nickname();

        if (!message || _.isEmpty(message)) {
            return null;
        }

        switch (message.type) {
            case SystemMessageTypes.INVITED_INTO_GROUP:
                return <p>{Strings.template(Lang.invitedIntoGroup, userName, _generateNicknames(message, userId))}</p>;
            case SystemMessageTypes.USER_INVITED_INTO_GROUP:
                return <p>{Strings.template(Lang.userInvitedIntoGroup, _generateNicknames(message, userId))}</p>;
            case SystemMessageTypes.USER_KICKED_OUT_GROUP:
                return <p>{Strings.template(Lang.userKickedOutGroup, _generateNicknames(message, userId))}</p>;
            case SystemMessageTypes.GROUP_NAME_CHANGED:
                return <p>{Strings.format(Lang.groupNameChanged, [userName, message.referName])}</p>;
            case SystemMessageTypes.CONTACT_JOINED:
                return <p>{Strings.format(Lang.contactJoined, [data.getRemarkName()])}</p>;
            default :
                return <p>{Lang.systemMessage}</p>;
        }
    }
});

// module initialization


// private functions
function _generateNicknames(message, userId) {
    return _.reduce(message.referInfo, function (memo, item) {
        if (!item.referUserId || !item.referUserName || item.referUserId == userId) {
            return memo;
        }
        memo.push(item.referUserName);
        return memo;
    }, []).join(Lang.nicknameSeparator);
}
