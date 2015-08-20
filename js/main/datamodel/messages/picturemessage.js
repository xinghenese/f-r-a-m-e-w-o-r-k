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

// private fields
var contentKeyMap = {
    original:   new KeyInfo('original',     KeyInfo.NUMBER_ZERO),
    width:      new KeyInfo('width',        KeyInfo.NUMBER_ZERO),
    height:     new KeyInfo('height',       KeyInfo.NUMBER_ZERO),
    url:        new KeyInfo('url',          KeyInfo.STRING_NOT_SET),
    size:       new KeyInfo('size',         KeyInfo.NUMBER_ZERO)
};
var PICTURE_MAX_WIDTH = 477;

// exports
function PictureMessage(data) {
    Message.call(this, data);
    Message.formatContent.call(this, contentKeyMap);
}

_.assign(PictureMessage.prototype, Message.prototype, {
    toElement: function (props) {
        var url = this.content.url;
        var width = this.content.width;
        var height = this.content.height;

        if (!url || !width || !height) {
            return null;
        }

        var displayWidth = Math.min(parseInt(width), PICTURE_MAX_WIDTH);
        var displayHeight = parseInt(height) / parseInt(width) * displayWidth;

        return <img src={urls.getResourceUrl(url)} width={displayWidth} height={displayHeight} {...props} />;
    }
});

module.exports = PictureMessage;

// module initialization


// private functions
