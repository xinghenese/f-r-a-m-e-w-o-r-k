/**
 * Created by Administrator on 2015/8/19.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');

var groups = require('../groups');
var users = require('../users');

// private fields
var keyMap = {
    group:          'msrid',
    user:           'msuid',
    targetUser:     'mstuid',
    atUser:         'atuid',
    uuid:           'uuid',
    roomType:       'rmtp',
    version:        'ver',
    minVersion:     'minver',
    alternate:      'alt',
    cursor:         'mscs',
    timeStamp:      'tmstp',
    status:         'status',
    content:        'msg'
};

var STRING_NOT_SET = '';
var NUMBER_NOT_SET = -1;

// exports
function Message(data) {
    _.forEach(keyMap, function (value, key) {
        this[key] = data[value];
    }, this);

    // adjustment
    var groupId = parseInt(this.group);
    this.group = groupId && groups.getGroup(groupId) || null;

    var userId = parseInt(this.user);
    this.user = userId && users.getUser(userId) || null;

    var targetUserId = parseInt(this.targetUser);
    this.targetUser = targetUserId && users.getUser(targetUserId) || null;

    var atUserId = parseInt(this.atUser);
    this.atUser = atUserId && users.getUser(atUserId) || null;
}

module.exports = Message;

// module initalization
_.assign(Message.prototype, {
    printContent: function () {
        if (_.isObject(this.content)) {
            return JSON.stringify(this.content);
        }
        return String(this.content);
    },
    toElement: function () {
        return <span>{this.printContent()}</span>;
    }
});

_.assign(Message, {
    formatContent: function (contentKeyMap) {
        var content = this.content;
        this.content = {};
        if (!content) {
            return;
        }
        _.forEach(contentKeyMap, function (sourceKey, targetKey) {
            this.content[targetKey] = content[sourceKey];
        }, this);
    }
});
