/**
 * Created by Administrator on 2015/8/19.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var Message = require('./message');
var SystemMessageTypes = require('../../constants/messageconstants').SystemMessageTypes;
var KeyInfo = require('../keyinfo');

// private fields
var rereferObjectKeyMap = {
    referUserId:    'referid',
    referUserName:  'refern'
};
var inverseReferObjectKeyMap = _.invert(rereferObjectKeyMap);

// exports
function SystemMessage(data) {
    Message.call(this, data);

    // adjustment
    this.systemMessageType = parseInt(data['tp']);
    var content = this.content = {type: this.systemMessageType};

    switch (this.systemMessageType) {
        case SystemMessageTypes.COMMON_USED:
            _.assign(content, {text: data['msg'] && data['msg']['t']});
            break;
        case SystemMessageTypes.INVITED_INTO_GROUP:
        case SystemMessageTypes.USER_INVITED_INTO_GROUP:
            var referInfo = this.content.referInfo = [];
            _.forEach(data['referobj'], function (info, index) {
                referInfo[index] = _.mapKeys(info, function (value, key) {
                    return inverseReferObjectKeyMap[key] || key;
                })
            }, this);
            break;
        case SystemMessageTypes.GROUP_NAME_CHANGED:
            _.assign(this.content, {referName: data['refern']});
            break;
    }
}

_.assign(SystemMessage.prototype, Message.prototype, {
    toElement: function (props) {
        return <span {...props}>{this.content && this.content.text}</span>;
    }
});

module.exports = SystemMessage;

// module initialization


// private functions
