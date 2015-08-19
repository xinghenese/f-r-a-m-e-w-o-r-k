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
    original:   'original',
    width:      'width',
    height:     'height',
    url:        'url',
    size:       'size'
};

// exports
function PictureMessage(data) {
    Message.call(this, data);
    Message.formatContent.call(this, contentKeyMap);
}

_.assign(PictureMessage.prototype, Message.prototype, {
    toElement: function () {
        return <img src={this.content.url} width={} />;
    }
});

module.exports = PictureMessage;

// module initialization


// private functions
