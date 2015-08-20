/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var makeStyle = require('../../../style/styles').makeStyle;
var commonStyle = require('../../../style/common');
var Lang = require('../../../locales/zh-cn');
var globalEmitter = require('../../../events/globalemitter');
var EventTypes = require('../../../constants/eventtypes');

var createGenerator = require('../../base/creator/createReactClassGenerator');
var groupableMixin = require('../../base/specs/list/groupable');
var multiselectableMixin = require('../../base/specs/list/multiselectable');
var Avatar = require('../../avatar');
var messageConstants = require('../../../constants/messageconstants');
var ChatMessage = require('./chatmessage');

//private fields
var createGroupableClass = createGenerator({
    mixins: [groupableMixin, multiselectableMixin]
});
var now = new Date();

//core module to export
module.exports = createGroupableClass({
    displayName: 'ChatMessageList',
    getDefaultProps: function () {
        return {intialEnableSelect: false};
    },
    groupBy: function (message, key) {
        var time = new Date(message.timestamp);
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
    _modifyCurrentChat: function (event) {
        this.setState({
            enableSelect: !!(event && event.modifyEnable),
            selectedKeys: []
        });
    },
    componentDidMount: function () {
        globalEmitter.on(EventTypes.MODIFY_CHAT_MESSAGES, this._modifyCurrentChat);
    },
    compnonentWillUnmount: function () {
        globalEmitter.removeListener(EventTypes.MODIFY_CHAT_MESSAGES, this._modifyCurrentChat);
    },
    renderGroupTitle: function (data, props, key) {
        return (
            <div {...props}><p style={props.style.time}>{key}</p></div>
        );
    },
    renderItem: function (message, props, key) {
        if (!isValidMessageData(message)) {
            console.info('inValidMessageData');
            return null;
        }
        var className = props.className || 'chat-message';
        var style = props.style || {};
        var checkbox = null;

        if (this.state.enableSelect) {
            checkbox = (
                <div
                    className={className + '-checkbox'}
                    style={style.checkbox}
                    dangerouslySetInnerHTML={{
                        __html: _.includes(this.state.selectedKeys, key) ? '&#10003;' : ''
                    }}
                    />
            );
        }

        if (message.type == messageConstants.MessageTypes.SYSTEM) {
            console.info('chatMessageList#renderItem: , SystemMessage');
            return (
                <li style={makeStyle(style.system)}>
                    <ChatMessage data={message} style={style.system.message}/>
                </li>
            )
        }

        return (
            <li>
                <Avatar
                    className={className + '-avatar'}
                    style={makeStyle(style.avatar)}
                    name={message.user.getNickname()}
                    src={message.user.picture()}
                    index={message.user.getUserId()}
                    />
                {checkbox}
                <div
                    className={className + '-time'}
                    style={makeStyle(style.time)}
                    >
                    {new Date(message.timestamp).toLocaleTimeString()}
                </div>
                <div
                    className={className + '-body'}
                    style={makeStyle(commonStyle.message, style.messagebody)}
                    >
                    <div className={className + '-nickname'}>
                        {message.user.getNickname()}
                    </div>
                    <div
                        className={className + '-content'}
                        style={makeStyle(style.messagebody.messagecontent)}
                        >
                        <ChatMessage data={message}/>
                    </div>
                </div>
            </li>
        )
    }
});

//private function
function isValidMessageData(data) {
    return data && !_.isEmpty(data) && data.user && data.user.getNickname();
}
