/**
 * Created by kevin on 7/3/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var Group = require('./group');

// exports
var groups = {
    _cursor: "",
    // todo: to be optimized, use map to save the groups
    _groups: [],
    addGroup: function (group) {
        this._groups.push(group);
    },
    getCursor: function () {
        return this._cursor;
    },
    getGroup: function (groupId) {
        var groupIdInt = parseInt(groupId);
        var group = _.find(this._groups, function (group) {
            return group.getGroupId() === groupIdInt;
        });
        return group;
    },
    getGroups: function() {
        return _.clone(this._groups);
    },
    removeGroup: function (groupId) {
        _.remove(this._groups, function (group) {
            return group.getGroupId() === groupId;
        });
    },
    setCursor: function (cursor) {
        this._cursor = cursor;
    },
    setGroups: function (arr) {
        this._groups = arr;
    }
};

module.exports = groups;
