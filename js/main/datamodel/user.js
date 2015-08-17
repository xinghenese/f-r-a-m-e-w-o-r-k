/**
 * Created by kevin on 7/5/15.
 */
'use strict';

// dependencies
var config = require('../etc/config');
var objects = require('../utils/objects');

// exports
function User(data) {
    this._data = data;
}

User.prototype.getUserId = function () {
    return this._data["uid"];
};

User.prototype.listedInConversations = function () {
    return objects.getBool(this._data["od"]);
};

User.prototype.listedInContacts = function () {
    return objects.getBool(this._data["ic"]);
};

User.prototype.getNickname = function () {
    return this._data["unk"];
};

User.prototype.picture = function () {
    if (this._data["pt"]) {
        return config.resourceDomain + this._data["pt"];
    }
    return null;
};

User.prototype.code = function () {
    return this._data["cc"];
};

User.prototype.phone = function () {
    return this._data["mid"];
};

User.prototype.pinyin = function () {
    return this._data["py"];
};

User.prototype.pinyinAbbr = function () {
    return this._data["pys"];
};

User.prototype.isContact = function () {
    return !!this._data["mid"];
};

module.exports = User;
