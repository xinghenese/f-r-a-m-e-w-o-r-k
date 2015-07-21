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

//core module to export
var ChatMessageList = React.createClass({
    getInitialState: function() {
        return {data: null};
    },
    render: function() {
        var inlineStyle = this.props.style || {};
        var chatMessageNodes = null;

        if (this.state.data) {
            chatMessageNodes = _.map(this.state.data, function(data) {
                return (
                    <ChatMessage
                    key={prefix + (index++)}
                    time={data.time}
                    senderName={data.senderName}
                    senderAvatar={data.senderAvatar}
                    style={inlineStyle.chatmessage}
                    >
                    {data.message}
                    </ChatMessage>
                    );
            }, this);
        }

        return (
            <div className="chat-message-list" style={makeStyle(inlineStyle)}>
                {chatMessageNodes}
            </div>
        )
    }
});

module.exports = ChatMessageList;