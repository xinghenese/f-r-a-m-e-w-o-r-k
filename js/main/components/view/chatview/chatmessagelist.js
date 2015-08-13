/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var makeStyle = require('../../../style/styles').makeStyle;
var commonStyle = require('../../../style/common');
var Lang = require('../../../locales/zh-cn');

var createGenerator = require('../../base/creator/createReactClassGenerator');
var groupableMixin = require('../../base/specs/list/groupable');
var listableMixin = require('../../base/specs/list/listable');
var Avatar = require('../../avatar');

//private fields
var createGroupableClass = createGenerator({
    mixins: [groupableMixin]
});
var now = new Date();

//core module to export
module.exports = createGroupableClass({
    displayName: 'ChatMessageList',
    groupBy: function (data, key) {
        var time = data.time;
        if (time.getFullYear() !== now.getFullYear() || time.getMonth() !== now.getMonth()) {
            return time.toDateString();
        }
        if (time.getDate() === now.getDate()) {
            return Lang.today;
        }
        if (time.getDate() + 1 === now.getDate()) {
            return Lang.yesterday;
        }
        return time.toDateString();
    },
    renderGroupTitle: function (data, props, key) {
        return (
            <div {...props}><p style={props.style.time}>{key}</p></div>
        )
    },
    renderItem: function (data, props, key) {
        if (!isValidMessageData(data)) {
            return null;
        }
        var className = props.className || 'chat-message';
        var style = props.style || {};

        return (
            <li>
                <Avatar
                    className={className + '-avatar'}
                    style={makeStyle(style.avatar)}
                    name={data.senderName}
                    src={data.senderAvatar}
                    index={data.senderId}
                    />

                <div
                    className={className + '-time'}
                    style={makeStyle(style.time)}
                    >
                    {data.time.toLocaleTimeString()}
                </div>
                <div
                    className={className + '-body'}
                    style={makeStyle(commonStyle.message, style.messagebody)}
                    >
                    <div className={className + '-nickname'}>
                        {data.senderName}
                    </div>
                    <p
                        className={className + '-content'}
                        style={makeStyle(style.messagebody.messagecontent)}
                        >
                        {data.message}
                    </p>
                </div>
            </li>
        )
    }
});

//private function
function isValidMessageData(data) {
    return data && !_.isEmpty(data) && data.senderName && data.message;
}
