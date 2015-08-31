/**
 * Created by kevin on 7/1/15.
 */
'use strict';

var UuidGenerator = require('node-uuid');
var UserAgent = require('../utils/useragent');

module.exports = {
    uuid: createUuidIfNotCached(),
    uid: -1,
    nickname: "",
    avatar: "",
    deviceType: 3,
    deviceInfo: UserAgent.getDeviceInfo(),
    officeSystem: UserAgent.getOS(),
    version: '1.0',
    zip: "1",

    hasPassword: false,
    autoPlayDynamicEmotion: false,
    autoPlayPrivateDynamicEmotion: false,
    autoPlayGroupDynamicEmotion: false,
    autoLoadPicture: false,
    autoLoadPrivatePicture: false,
    autoLoadGroupPicture: false,
    autoPlayAudio: false,
    autoPlayPrivateAudio: false,
    autoPlayGroupAudio: false,
    autoSavePicture: false,
    autoSavePrivatePicture: false,
    autoSaveGroupPicture: false,
    enableNotification: true,
    enableVibrationNotification: true,
    enableContactJoinedNotification: true,
    enablePrivateMessageNotification: true,
    enableGroupMessageNotification: true,
    doNotDisturbStartTime: 0,
    doNotDisturbEndTime: 0,
    userRoomSettings: [],
    userPrivateSettings: [],

    token: "",
    refreshToken: "",
    tokenRefreshTime: 0,
    cursor: 0,
    topConversations: [],
    rooms: [],

    getProp: getProp
};

function createUuidIfNotCached() {
    var uuid = localStorage.getItem('uuid');
    if (!uuid) {
        uuid = UuidGenerator.v1();
        localStorage.setItem('uuid', uuid);
    }
    return uuid;
}

function getProp(key) {
    switch (String(key)) {
        case 'msuid':
            return this.uid;
        case 'devuuid':
            return this.uuid;
        case 'ver':
            return this.version;
        case 'os':
            return this.officeSystem;
        case 'dv':
        case 'dev':
            return this.deviceType;
        case 'di':
            return this.deviceInfo;
        case 'tk':
            return this.token;
        default:
            return this[key];
    }
}
