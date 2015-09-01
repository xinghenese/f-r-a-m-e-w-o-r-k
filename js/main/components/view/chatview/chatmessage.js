/**
 * Created by Administrator on 2015/8/16.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var MessageTypes = require('../../../constants/messageconstants').MessageTypes;
var Lang = require('../../../locales/zh-cn');
var setStyle = require('../../../style/styles').setStyle;
var Overlay = require('../../box/Overlay');
var Audio = require('../../tools/IntelAudio');
var Urls = require('../../../utils/urls');
var Map = require('../../tools/AMap');

// private fields
var PICTURE_MAX_WIDTH = 462;

var TextMessage = React.createClass({
    render: function() {
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
            <div className="content image" style={{width: width, height: height}}>
                <img src={Urls.getResourceUrl(message.url)} width="100%" height="100%"
                     onDoubleClick={this._showOriginalImage}/>
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

var LocationMessage = React.createClass({
    render: function () {
        return (
            <div class="content geo-location">
                <Map longitude={this.props.message.longitude} latitude={this.props.message.latitude}/>
            </div>
        );
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
    var type = data && data.type;
    var message = data && data.content;

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
        default:
            return <TextMessage message={message}/>;
    }
}
