/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var ChatMessage = require('./chatmessage');
var makeStyle = require('../../../style/styles').makeStyle;
var prefix = "chat-message-list-";
var index = 0;

var createGenerator = require('../../base/creator/createReactClassGenerator');
var listableMixin = require('../../base/specs/list/listable');
var Avatar = require('../../avatar');

//private fields
var createListClass = createGenerator({
    mixins: [listableMixin]
});

//core module to export
module.exports = createListClass({
    displayName: 'ChatMessageList',
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
                    style={makeStyle(style.avatar, inlineStyle.avatar)}
                    name={this.props.senderName}
                    src={this.props.senderAvatar}
                    index={this.props.senderName}
                    />

                <div
                    className={className + '-time'}
                    style={makeStyle(style.time, inlineStyle.time)}
                    >
                    {this.props.time}
                </div>
                <div className={className + '-body'}
                     style={makeStyle(commonStyle.message, style.messagebody, inlineStyle.messagebody)}
                    >
                    <div className={className + '-nickname'}>
                        {this.props.senderName}
                    </div>
                    <p className={className + '-content'} style={makeStyle(style.messagebody.messagecontent)}>
                        {this.props.children}
                    </p>
                </div>
            </li>
        )
    },
    render: function () {
        var chatMessageNodes = null;

        if (this.props.data && !_.isEmpty(this.props.data)) {
            chatMessageNodes = _.map(this.props.data, function (data, key) {
                if (isValidMessageData(data)) {
                    return (
                        <ChatMessage
                            key={prefix + key}
                            time={data.time}
                            senderName={data.senderName}
                            senderAvatar={data.senderAvatar}
                            style={this.props.style.chatmessage}
                            >
                            {data.message}
                        </ChatMessage>
                    );
                }
            }, this);
        }

        return (
            <div className="chat-message-list" style={makeStyle(this.props.style)}>
                {chatMessageNodes}
            </div>
        )
    }
});

//private function
function isValidMessageData(data) {
    return data && !_.isEmpty(data) && data.senderName && data.message;
}
