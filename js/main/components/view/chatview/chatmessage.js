/**
 * Created by Administrator on 2015/8/16.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var MessageConstants = require('../../../constants/messageconstants');
var MessageTypes = MessageConstants.MessageTypes;
var SystemMessageTypes = MessageConstants.SystemMessageTypes;
var Lang = require('../../../locales/zh-cn');
var setStyle = require('../../../style/styles').setStyle;
var makeStyle = require('../../../style/styles').makeStyle;
var Strings = require('../../../utils/strings');
var config = require('../../../etc/config');
var Overlay = require('../../box/Overlay');
var Audio = require('../../tools/IntelAudio');
var Urls = require('../../../utils/urls');

// private fields
var PICTURE_MAX_WIDTH = 462;
var RESOURCE_URL = config.resourceDomain;

var TextMessage = React.createClass({
    render: function () {
        return <div className="content text">{String(this.props.message.text || this.props.message || '')}</div>;
    }
});

var PictureMessage = React.createClass({
    _showOriginalImage: function(event) {
        var message = this.props.message;
        Overlay.show(
            <img src={Urls.getResourceUrl(message.url)} width={message.width} height={message.height}
                 onWheel={this._resizeImage} data-original-width={message.width} data-original-height={message.height}
                 data-delta-size={0}/>
        );
    },
    _resizeImage: function(event) {
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
    render: function() {
        var message = this.props.message;

        if (!message.url || !message.width || !message.height) {
            return null;
        }

        var width = Math.min(parseInt(message.width), PICTURE_MAX_WIDTH);
        var height = parseInt(message.height) / parseInt(message.width) * width;

        return (
            <div className="content image">
                <img src={Urls.getResourceUrl(message.url)} width={width} height={height} onDoubleClick={this._showOriginalImage}/>
            </div>
        );
    }
});

var AudioMessage = React.createClass({
    render: function() {
        var url = this.props.message.url;
        var duration = this.props.message.duration;

        if (!url) {
            return null;
        }

        return <Audio className="content" src={Urls.getResourceUrl(url)} duration={duration}/>;
    }
});

var SystemMessage = React.createClass({
    render: function() {
        var message = this.props.message;
        switch (message.type) {
            case SystemMessageTypes.INVITED_INTO_GROUP:
                return (<span style={makeStyle(this.props.style)}>{
                    Strings.template(Lang.invitedIntoGroup, this.props.userName, _generateNicknames(message, this.props.userId))
                }</span>);
            case SystemMessageTypes.USER_INVITED_INTO_GROUP:
                return (<span style={makeStyle(this.props.style)}>{
                    Strings.template(Lang.userInvitedIntoGroup, _generateNicknames(message, this.props.userId))
                }</span>);
            case SystemMessageTypes.GROUP_NAME_CHANGED:
                return (<span style={makeStyle(this.props.style)}>{
                    Strings.format(Lang.groupNameChanged, [this.props.userName, this.props.message.referName])
                }</span>);
            case SystemMessageTypes.CONTACT_JOINED:
                return (<span style={makeStyle(this.props.style)}>{
                    Strings.format(Lang.contactJoined, [this.props.data.getRemarkName()])
                    }</span>);
            default :
                return (<span style={makeStyle(this.props.style)}>{Lang.systemMessage}</span>);
        }
    }
});

// exports
module.exports = React.createClass({
    displayName: 'ChatMessage',
    render: function() {
        var data = this.props.data;

        if (!data || _.isEmpty(data)) {
            return null;
        }
        return _createMessageNode(data);
    }
});

// private functions
function _createMessageNode(data) {
    var type = data.type;
    var message = data.content;
    var userId = data.user.getUserId();
    var userName = data.user.nickname();

    if (!message || _.isEmpty(message)) {
        return null;
    }

    switch (type) {
        case MessageTypes.TEXT:
            return <TextMessage message={message}/>;
        case MessageTypes.PICTURE:
            return <PictureMessage message={message}/>;
        case MessageTypes.AUDIO:
            return <AudioMessage message={message}/>;
        case MessageTypes.SYSTEM:
            return <SystemMessage message={message} userId={userId} userName={userName} data={data}/>;
        default:
            return <TextMessage message={message}/>;
    }
}

function _generateNicknames(message, userId) {
    return _.reduce(message.referInfo, function(memo, item) {
        if (!item.referUserId || !item.referUserName || item.referUserId == userId) {
            return memo;
        }
        memo.push(item.referUserName);
        return memo;
    }, []).join(Lang.nicknameSeparator);
}
