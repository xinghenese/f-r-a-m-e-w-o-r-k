/**
 * Created by Administrator on 2015/8/7.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var makeStyle = require('../../../../style/styles').makeStyle;
var groupable = require('./groupable');

// private fields
var currentItemKey;

// exports
module.exports = _.create(groupable, {
    preprocessData: function (data) {
        if ((_.isArray(data) || _.isObject(data)) && !_.isEmpty(data)) {
            return {data: data};
        }
        return [];
    },
    renderTitle: function () {
        return null;
    }
});

// module initialization


// private functions
