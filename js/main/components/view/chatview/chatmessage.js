/**
 * Created by Administrator on 2015/8/16.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var MessageConstants = require('../../../constants/messageconstants');
var MessageTypes = MessageConstants.MessageTypes;
var Lang = require('../../../locales/zh-cn');
var makeStyle = require('../../../style/styles').makeStyle;
var Strings = require('../../../utils/strings');
var config = require('../../../etc/config');

// private fields
var PICTURE_MAX_WIDTH = 477;
var RESOURCE_URL = config.resourceDomain;

// exports
module.exports = React.createClass({
    displayName: 'ChatMessage',
    render: function () {
        var data = this.props.data;

        if (!data || _.isEmpty(data)) {
            return null;
        }

        var element = createMessageNode(data);

        return element && React.cloneElement(
            element,
            {style: makeStyle(this.props.style)}
        );
    }
});

// module initialization


// private functions
function createMessageNode(data) {
    var type = data.messageType;
    var message = data.message;
    var userId = data.senderId;
    var userName = data.senderName;

    if (!type || !message || _.isEmpty(message)) {
        return null;
    }

    switch (type) {
        case MessageTypes.TEXT:
            return <span>{message.t || ''}</span>;
        case MessageTypes.PICTURE:
            var width = Math.min(message.width, PICTURE_MAX_WIDTH);
            var height = message.height / message.width * width;
            var src = message.url.indexOf(RESOURCE_URL) > -1 ? message.url : RESOURCE_URL + message.url;
            return <img src={src} width={width} height={height} onDoubleClick={function(e) {

            }}/>;
        case MessageTypes.AUDIO:
            src = message.url.indexOf(RESOURCE_URL) > -1 ? message.url : RESOURCE_URL + message.url;
            return <audio src={src}/>;
        case Number(MessageTypes.SYSTEM):
            if (!message.type || !message.referobj || _.isEmpty(message.referobj)) {
                return <span>{Lang.systemMessage}</span>
            }

            var nicknames = _.reduce(message.referobj, function (memo, item) {
                if (!item.referid || !item.refern || item.referid == userId) {
                    return memo;
                }
                memo.push(item.refern);
                return memo;
            }, []);
            switch (message.type) {
                case MessageTypes.SYSTEM.INVITED_INTO_GROUP:
                    return <span>{Strings.template(Lang.invitedIntoGroup, userName, nicknames)}</span>;
                case MessageTypes.SYSTEM.USER_INVITED_INTO_GROUP:
                    return <span>{Strings.template(Lang.userInvitedIntoGroup, nicknames)}</span>;
                default :
                    return <span>{Lang.systemMessage}</span>;
            }
        default :
            return <span>{message.t || ''}</span>;
    }
}
