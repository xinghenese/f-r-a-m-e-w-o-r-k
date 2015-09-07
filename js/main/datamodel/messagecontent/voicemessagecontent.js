/**
 * Created by Administrator on 2015/9/6.
 */
'use strict';

var _ = require('lodash');
var React = require('react');
var model = require('../model');
var KeyInfo = require('../keyinfo');
var urls = require('../../utils/urls');
var Audio = require('../../components/tools/IntelAudio');
var Lang = require('../../locales/zh-cn');

module.exports = model.extend({
    keyMap: {
        duration:   new KeyInfo('duration',     Number,     KeyInfo.NUMBER_ZERO),
        url:        new KeyInfo('url',          String)
    },
    toString: function () {
        return Lang.audioMessage;
    },
    toReactElement: function (props) {
        var url = this.url;
        var duration = this.duration;

        if (!url || !duration) {
            return null;
        }

        return <Audio className="content" src={urls.getResourceUrl(url)} duration={duration} {...props}/>;
    }
});
