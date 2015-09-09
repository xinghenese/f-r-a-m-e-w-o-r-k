/**
 * Created by Administrator on 2015/9/6.
 */
'use strict';

var _ = require('lodash');
var React = require('react');
var model = require('../model');
var KeyInfo = require('../keyinfo');
var Lang = require('../../locales/zh-cn');
var Map = require('../../components/tools/AMap');

module.exports = model.extend({
    keyMap: {
        longitude:  new KeyInfo('longitude',    Number),
        latitude:   new KeyInfo('latitude',     Number)
    },
    toString: function () {
        return Lang.locationMessage;
    },
    toReactElement: function (props) {
        return (
            <div className="content geo-location" {...props}>
                <Map longitude={this.longitude} latitude={this.latitude}/>
            </div>
        );
    }
});
