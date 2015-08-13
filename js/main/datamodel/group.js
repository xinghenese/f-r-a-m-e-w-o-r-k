/**
 * Created by kevin on 7/3/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var Lang = require('../locales/zh-cn');
var User = require('../datamodel/user');
var objects = require('../utils/objects');

// private fields
var MEMBERS_CURSOR_FIELD = "membersCursor";

// exports
function Group(data) {
    this._data = data;
}

Group.prototype.getGroupId = function () {
    return parseInt(this._data["rid"]);
};

Group.prototype.listedInConversations = function () {
    return objects.getBool(this._data["od"] || 1);
};

Group.prototype.inGroup = function () {
    return objects.getBool(this._data["ij"] || 1);
};

Group.prototype.name = function () {
    return this._data["rn"] || this._generateNameFromMembers();
};

Group.prototype.countOfMembers = function () {
    return parseInt(this._data["jmt"] || 0);
};

Group.prototype.picture = function () {
    return this._data["pt"] || "";
};

Group.prototype.tooManyMessages = function () {
    return objects.getBool(this._data["if"] || 0);
};

Group.prototype.members = function () {
    return _.map(this._data["jml"] || [], function(item) {
        return new User(item);
    });
};

Group.prototype.setMembers = function (arr) {
    this._data["jml"] = arr;
};

Group.prototype.stickyMessage = function () {
    return this._data["tmsg"];
};

Group.prototype.setMembersCursor = function (cursor) {
    this._data[MEMBERS_CURSOR_FIELD] = cursor;
};

Group.prototype.getMembersCursor = function () {
    return this._data[MEMBERS_CURSOR_FIELD];
};

Group.prototype._generateNameFromMembers = function() {
    var name = "";
    var members = this.members();
    var first = true;
    if (members) {
        _.forEach(members, function(member) {
            if (first) {
                first = false;
            } else {
                name = name.concat(Lang.nicknameSeparator);
            }
            name = name.concat(member.getNickname());
        });
    }
    return name;
};

module.exports = Group;
