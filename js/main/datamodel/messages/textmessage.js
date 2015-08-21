/**
 * Created by Administrator on 2015/8/19.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var Message = require('./message');
var KeyInfo = require('../keyinfo');

// private fields
var contentKeyMap = {
    text:   new KeyInfo('t',    String)
};

// exports
function TextMessage(data) {
    Message.call(this, data);
    Message.formatContent.call(this, contentKeyMap);
}

module.exports = TextMessage;

// module initialization
_.assign(TextMessage.prototype, Message.prototype, {
    toElement: function (props) {
        return <span {...props}>{this.content.text}</span>;
    }
});

TextMessage.create = function (data) {
    return new TextMessage(data);
};


// private functions
