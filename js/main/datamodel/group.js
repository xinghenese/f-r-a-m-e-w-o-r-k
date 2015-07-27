/**
 * Created by kevin on 7/3/15.
 */
'use strict';

// dependencies
var objects = require('../utils/objects');

// private fields
var MEMBERS_CURSOR_FIELD = "membersCursor";

// exports
function Group(data) {
    this._data = data;
}

Group.prototype.getGroupId = function() {
    return parseInt(this._data["rid"]);
};

Group.prototype.listedInConversations = function() {
    return objects.getBool(this._data["od"]);
};

Group.prototype.inGroup = function() {
    return objects.getBool(this._data["ij"]);
};

Group.prototype.name = function() {
    return this._data["rn"];
};

Group.prototype.countOfMembers = function() {
    return parseInt(this._data["jmt"]);
};

Group.prototype.picture = function() {
    return this._data["pt"];
};

Group.prototype.tooManyMessages = function() {
    return objects.getBool(this._data["if"]);
};

Group.prototype.members = function() {
    return this._data["jml"];
};

Group.prototype.setMembers = function(arr) {
    this._data["jml"] = arr;
};

Group.prototype.stickyMessage = function() {
    return this._data["tmsg"];
};

Group.prototype.setMembersCursor = function(cursor) {
    this._data[MEMBERS_CURSOR_FIELD] = cursor;
};

Group.prototype.getMembersCursor = function() {
    return this._data[MEMBERS_CURSOR_FIELD];
};

module.exports = Group;
