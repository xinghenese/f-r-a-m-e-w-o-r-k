/**
 * Created by Administrator on 2015/8/19.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var Message = require('./message');
var KeyInfo = require('../keyinfo');
var urls = require('../../utils/urls');
var Audio = require('../../components/tools/IntelAudio');

// private fields
var contentKeyMap = {
    duration:   new KeyInfo('duration',     KeyInfo.NUMBER_NOT_SET),
    url:        new KeyInfo('url',          KeyInfo.STRING_NOT_SET)
};

// exports
function VoiceMessage(data) {
    Message.call(this, data);
    Message.formatContent.call(this, contentKeyMap);
}

_.assign(VoiceMessage.prototype, Message.prototype, {
    toElement: function (props) {
        var url = this.content.url;
        var duration = this.content.duration;

        if (!url || duration == KeyInfo.NUMBER_NOT_SET) {
            return null;
        }

        return <Audio src={urls.getResourceUrl(url)} duration={duration} {...props}/>;
    }
});

module.exports = VoiceMessage;

// module initialization


// private functions
