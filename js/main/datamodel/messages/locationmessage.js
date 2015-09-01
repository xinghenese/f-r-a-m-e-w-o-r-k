/**
 * Created by Administrator on 2015/8/21.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var Message = require('./message');
var KeyInfo = require('../keyinfo');

// private fields
var contentKeyMap = {
    longitude:  new KeyInfo('longitude',    Number),
    latitude:   new KeyInfo('latitude',     Number)
};

// exports
function LocationMessage(data) {
    Message.call(this, data);
    Message.formatContent.call(this, contentKeyMap);
}

module.exports = LocationMessage;

// module initialization
_.assign(LocationMessage.prototype, Message.prototype, {
    toElement: function (props) {
        return <span {...props}>({this.content.longitude}, {this.content.latitude})</span>;
    }
});

LocationMessage.create = function (data) {
    return new LocationMessage(data);
};

// private functions
