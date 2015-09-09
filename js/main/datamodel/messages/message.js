/**
 * Created by Administrator on 2015/8/19.
 */
'use strict';

var _ = require('lodash');
var React = require('react');

var KeyInfo = require('../keyinfo');
var groups = require('../groups');
var Group = require('../group');
var myself = require('../myself');
var users = require('../users');
var User = require('../user');

var MessageConstants = require('../../constants/messageconstants');
var model = require('../model');
var MessageContent = require('../messagecontent/messagecontent');

module.exports = model.extend({
    keyMap: {
        // group
        groupId:        new KeyInfo('msrid', Number),
        group:          new KeyInfo(KeyInfo.compose({rid: 'msrid'}), groups, groups.emptyGroup),
        // user
        userId:         new KeyInfo('msuid', Number),
        userNickname:   new KeyInfo('unk', String),
        userRemarkname: new KeyInfo('rmk', String),
        user:           new KeyInfo(KeyInfo.compose({uid: 'msuid', unk: 'unk', rmk: 'rmk'}), users, users.emptyUser),
        // targetUser
        targetUserId:   new KeyInfo('mstuid', Number),
        targetUser:     new KeyInfo(KeyInfo.compose({uid: 'mstuid'}), users, users.emptyUser),
        // atUser
        atUserId:       new KeyInfo('atuid', Number),
        atUser:         new KeyInfo(KeyInfo.compose({uid: 'atuid'}), users, users.emptyUser),
        // other basic info
        uuid:           new KeyInfo('uuid', String),
        roomType:       new KeyInfo('rmtp', Number),
        version:        new KeyInfo('ver', String),
        minVersion:     new KeyInfo('minver', String),
        alternate:      new KeyInfo('alt', String),
        cursor:         new KeyInfo('mscs', Number),
        timestamp:      new KeyInfo('tmstp', Number),
        time:           new KeyInfo('tmstp', Date),
        status:         new KeyInfo('status', Number, MessageConstants.Status.UNKNOWN),

        type:           new KeyInfo('msgtp', Number),
        dontCount:      new KeyInfo('dntcnt', Boolean),
        // content
        content:        new KeyInfo(KeyInfo.compose({type: 'msgtp', tp: 'tp', msg: 'msg', uid: 'msuid', unk: 'unk', rmk: 'rmk', refer: ['referobj', 'refern']}), MessageContent),
        subtype:        new KeyInfo('tp', Number)
    },
    hashCode: function () {
        return this.uuid;
    },
    fromMe: function() {
        return this.userId === myself.uid;
    },
    markSendingStatus: function () {
        this.status = MessageConstants.Status.SENDING;
    },
    markReceivedStatus: function () {
        this.status = MessageConstants.Status.RECEIVED;
    },
    markReadStatus: function () {
        this.status = MessageConstants.Status.READ;
    },
    markFailedStatus: function () {
        this.status = MessageConstants.Status.FAILED;
    },
    markSentStatus: function () {
        this.status = MessageConstants.Status.SENT;
    },
    toReactElement: function() {
        var content = String(this.content);
        if (_.isObject(this.content)) {
            content = JSON.stringify(this.content);
        }
        return <span>{content}</span>;
    }
});
