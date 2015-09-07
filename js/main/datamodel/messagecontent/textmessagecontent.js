/**
 * Created by Administrator on 2015/9/6.
 */
'use strict';

var _ = require('lodash');
var React = require('react');
var model = require('../model');
var KeyInfo = require('../keyinfo');

module.exports = model.extend({
    keyMap: {
        text: new KeyInfo('t', String)
    },
    toString: function () {
        return this.text;
    },
    toReactElement: function (props) {
        return <div className="content text" {...props}>{String(this.text || '')}</div>;
    }
});
