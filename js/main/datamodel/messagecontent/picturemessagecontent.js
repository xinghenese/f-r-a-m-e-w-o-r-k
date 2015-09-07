/**
 * Created by Administrator on 2015/9/6.
 */
'use strict';

var _ = require('lodash');
var React = require('react');
var screenfull = require('screenfull');
var model = require('../model');
var KeyInfo = require('../keyinfo');
var urls = require('../../utils/urls');
var Lang = require('../../locales/zh-cn');
var Urls = require('../../utils/urls');

var PICTURE_MAX_WIDTH = 477;

module.exports = model.extend({
    keyMap: {
        original:   new KeyInfo('original',     Number,     KeyInfo.NUMBER_ZERO),
        width:      new KeyInfo('width',        Number,     KeyInfo.NUMBER_ZERO),
        height:     new KeyInfo('height',       Number,     KeyInfo.NUMBER_ZERO),
        url:        new KeyInfo('url',          String),
        size:       new KeyInfo('size',         Number,     KeyInfo.NUMBER_ZERO)
    },
    toString: function () {
        return Lang.pictureMessage;
    },
    toReactElement: function (props) {
        var url = this.url;
        var width = this.width;
        var height = this.height;

        if (!url || !width || !height) {
            return null;
        }

        var displayWidth = Math.min(parseInt(width), PICTURE_MAX_WIDTH);
        var displayHeight = parseInt(height) / parseInt(width) * displayWidth;

        return (
            <div className="content image" style={{width: displayWidth, height: displayHeight}} {...props}>
                <img src={Urls.getResourceUrl(url)} width="100%" height="100%" onClick={showFullScreen}/>
            </div>
        );
    }
});

function showFullScreen(event) {
    if (screenfull.enabled) {
        screenfull.toggle(event.target);
    }
}
