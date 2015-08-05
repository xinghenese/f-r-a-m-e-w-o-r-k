/**
 * Created by kevin on 7/1/15.
 */
'use strict';

// dependencies
var Config = require('../etc/config');

// exports
module.exports = {
    // user info
    mobileId: -1,
    countryCode: "+86",
    uuid: "",
    uid: -1,
    nickname: "",
    avatar: "",
    version: "1.0",
    // platform info
    device: Config.device,
    deviceInfo: "",
    operatingSystem: "",
    // settings
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
    // token
    token: "",
    refreshToken: "",
    tokenRefreshTime: 0,
    // cursor
    cursor: 0,
    // conversations
    topConversations: [],
    //rooms
    rooms: []
};
