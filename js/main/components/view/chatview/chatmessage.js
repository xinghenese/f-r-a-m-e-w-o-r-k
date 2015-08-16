/**
 * Created by Administrator on 2015/8/16.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var MessageConstants = require('../../../constants/messageconstants');
var MessageTypes = MessageConstants.MessageTypes;

// private fields
var PICTURE_MAX_WIDTH = 477;
var RESOURCE_URL = 'http://dev.r.topcmm.net/';

// exports
module.exports = React.createClass({
    displayName: 'ChatMessage',
    render: function () {
        return createMessageNode(this.props.messageType, this.props.message);
    }
});

// module initialization


// private functions
function createMessageNode(type, msg) {
    switch (type) {
        case MessageTypes.TEXT:
            return <span>{msg.t || ''}</span>;
        case MessageTypes.PICTURE:
            var width = Math.min(msg.width, PICTURE_MAX_WIDTH);
            var height = msg.height / msg.width * width;
            var src = msg.url.indexOf(RESOURCE_URL) > -1 ? msg.url : RESOURCE_URL + msg.url;
            return <img src={src} width={width} height={height} onDoubleClick={function(e) {

            }}/>;
        case MessageTypes.AUDIO:
            src = msg.url.indexOf(RESOURCE_URL) > -1 ? msg.url : RESOURCE_URL + msg.url;
            return <audio src={src} />;
        case MessageTypes.SYSTEM:
            return <span>{msg.t || ''}</span>;
        default :
            return <span>{msg.t || ''}</span>;
    }
}
