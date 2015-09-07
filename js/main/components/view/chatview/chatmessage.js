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
var screenfull = require('screenfull');

// private fields
var PICTURE_MAX_WIDTH = 462;

var TextMessage = React.createClass({
    render: function() {
        return <div className="content text">{String(this.props.message.text || this.props.message || '')}</div>;
    }
});

var PictureMessage = React.createClass({
    _showFullScreen: function () {
        if (screenfull.enabled) {
            screenfull.toggle(React.findDOMNode(this));
        }
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
                     onClick={this._showFullScreen}/>
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
            <div className="content geo-location">
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
        case MessageTypes.LOCATION:
            return <LocationMessage message={message}/>;
        default:
            return <TextMessage message={message}/>;
    }
}
