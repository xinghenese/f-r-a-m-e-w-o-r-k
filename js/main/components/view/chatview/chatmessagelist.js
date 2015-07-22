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
    render: function() {
        var chatMessageNodes = null;

        if (this.props.data && !_.isEmpty(this.props.data)) {
            chatMessageNodes = _.map(this.props.data, function(data) {
                if (!isValidMessageData(data)) {
                    return null;
                }
                return (
                    <ChatMessage
                    key={prefix + (index++)}
                    time={data.time}
                    senderName={data.senderName}
                    senderAvatar={data.senderAvatar}
                    style={this.props.style.chatmessage}
                    >
                    {data.message}
                    </ChatMessage>
                    );
            }, this);
        }

        return (
            <div className="chat-message-list" style={makeStyle(this.props.style)}>
                {chatMessageNodes}
            </div>
        )
    }
});

module.exports = ChatMessageList;

//private function
function isValidMessageData(data) {
    return data && !_.isEmpty(data) && data.senderName && data.message;
}