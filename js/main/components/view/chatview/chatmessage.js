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
var setStyle = require('../../../style/styles').setStyle;
var Strings = require('../../../utils/strings');
var config = require('../../../etc/config');
var Overlay = require('../../box/Overlay');

// private fields
var PICTURE_MAX_WIDTH = 477;
var RESOURCE_URL = config.resourceDomain;

var TextMessage = React.createClass({
    render: function () {
        return <span style={makeStyle(this.props.style)}>{String(this.props.message.t || this.props.message || '')}</span>;
    }
});

var PictureMessage = React.createClass({
    _showOriginalImage: function (event) {
        var message = this.props.message;
        var src = message.url.indexOf(RESOURCE_URL) > -1 ? message.url : RESOURCE_URL + message.url;
        Overlay.show(
            <img src={src} width={message.width} height={message.height} onWheel={this._resizeImage}
                data-original-width={message.width} data-original-height={message.height}
                data-delta-size={0}/>
        );
    },
    _resizeImage: function (event) {
        var target = event.currentTarget;

        var originalWidth = parseInt(target.getAttribute('data-original-width'));
        var originalHeight = parseInt(target.getAttribute('data-original-height'));
        var deltaSize = parseInt(target.getAttribute('data-delta-size'));
        var deltaY = parseInt(event.deltaY);

        deltaSize -= deltaY;
        if (!deltaY || deltaSize < -500 || deltaSize > 500) {
            return;
        }
        var deltaRate = 1 + deltaSize / 1000;

        setStyle(
            target,
            {width: deltaRate * originalWidth + 'px', height: deltaRate * originalHeight + 'px'}
        );
        target.setAttribute('data-delta-size', String(deltaSize));
    },
    render: function () {
        var message = this.props.message;

        if (!message.url || !message.width || !message.height) {
            return null;
        }

        var width = Math.min(parseInt(message.width), PICTURE_MAX_WIDTH);
        var height = parseInt(message.height) / parseInt(message.width) * width;
        var src = message.url.indexOf(RESOURCE_URL) > -1 ? message.url : RESOURCE_URL + message.url;

        return <img src={src} width={width} height={height} onDoubleClick={this._showOriginalImage} style={makeStyle(this.props.style)} />;
    }
});

var AudioMessage = React.createClass({
    render: function () {
        var url = this.props.message.url;

        if (!url) {
            return null;
        }

        return <audio src={url.indexOf(RESOURCE_URL) > -1 ? url : RESOURCE_URL + url} style={makeStyle(this.props.style)} />;
    }
});

var SystemMessage = React.createClass({
    render: function () {
        var message = this.props.message;
        var userId = this.props.userId;
        var userName = this.props.userName;

        if (!message.type || !message.referobj || _.isEmpty(message.referobj)) {
            return <span style={makeStyle(this.props.style)}>{Lang.systemMessage}</span>
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
                return <span style={makeStyle(this.props.style)}>{Strings.template(Lang.invitedIntoGroup, userName, nicknames)}</span>;
            case MessageTypes.SYSTEM.USER_INVITED_INTO_GROUP:
                return <span style={makeStyle(this.props.style)}>{Strings.template(Lang.userInvitedIntoGroup, nicknames)}</span>;
            default :
                return <span style={makeStyle(this.props.style)}>{Lang.systemMessage}</span>;
        }
    }
});

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
            { style: makeStyle(this.props.style) }
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

    if (!message || _.isEmpty(message)) {
        return null;
    }

    switch (type) {
        case MessageTypes.TEXT:
            return <TextMessage message={message} />;
        case MessageTypes.PICTURE:
            return <PictureMessage message={message} />;
        case MessageTypes.AUDIO:
            return <AudioMessage message={message} />;
        case Number(MessageTypes.SYSTEM):
            return <SystemMessage message={message} userId={userId} userName={userName} />;
        default :
            return <TextMessage message={message} />;
    }
}
