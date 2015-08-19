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
    text: 't'
};

// exports
function TextMessage(data) {
    Message.call(this, data);
    Message.formatContent.call(this, contentKeyMap);
}

_.assign(TextMessage.prototype, Message.prototype, {
    toElement: function () {
        return <span>{this.content.text}</span>;
    }
});

module.exports = TextMessage;

// module initialization


// private functions
