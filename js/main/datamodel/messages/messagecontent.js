/**
 * Created by Administrator on 2015/8/19.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var model = require('../model');
var KeyInfo = require('../keyinfo');

// private fields


// exports
module.exports = model.extend();
function MessageContent(data, contentTransferMap) {
    this.content = {};
    if (!data['msg']) {
        return;
    }
    _.forEach(contentTransferMap, function (sourceKey, targetKey) {
        this.content[targetKey] = data['msg'][sourceKey];
    }, this);
}

// module initialization


// private functions
