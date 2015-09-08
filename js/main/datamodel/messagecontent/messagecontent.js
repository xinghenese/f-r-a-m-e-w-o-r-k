/**
 * Created by Administrator on 2015/8/19.
 */
'use strict';

module.exports = function (message) {
    var MessageTypes = require('../../constants/messageconstants').MessageTypes;

    if (!message) {
        return;
    }

    switch (message.type) {
        case MessageTypes.TEXT:
            return require('./textmessagecontent').create(message);
        case MessageTypes.PICTURE:
            return require('./picturemessagecontent').create(message);
        case MessageTypes.AUDIO:
            return require('./voicemessagecontent').create(message);
        case MessageTypes.LOCATION:
            return require('./locationmessagecontent').create(message);
        case MessageTypes.SYSTEM:
            return require('./systemmessagecontent').create(message);
        default :
            return require('./textmessagecontent').create(message);
    }
};
