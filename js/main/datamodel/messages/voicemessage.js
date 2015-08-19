/**
 * Created by Administrator on 2015/8/19.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var Message = require('./message');

// private fields
var contentKeyMap = {
    duration: 'duration',
    url: 'url'
};

// exports
function VoiceMessage(data) {
    Message.call(this, data);
    Message.formatContent.call(this, contentKeyMap);
}

_.assign(VoiceMessage.prototype, Message.prototype, {
    toElement: function () {
        return <audio src={this.content.url} />;
    }
});

module.exports = VoiceMessage;

// module initialization


// private functions
