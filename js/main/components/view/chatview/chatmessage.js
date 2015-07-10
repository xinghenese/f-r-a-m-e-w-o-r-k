/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var React = require('react');
var style = require('../../../style/chatmessage').chatmessagelist.chatmessage;
var commonStyle = require('../../../style/common');
var makeStyle = require('../../../style/styles').makeStyle;

//core module to export
var ChatMessage =  React.createClass({
  render: function(){
    var inlineStyle = this.props.style;
    return (
      <div className="chat-message" style={makeStyle(style, inlineStyle)}>
        <a
          className="chat-avatar"
          style={makeStyle(style.avatar, inlineStyle.avatar)}
        >
          <img
            alt={this.props.senderName}
            src={this.props.senderAvatar}
            width="100%"
            height="100%"
          />
        </a>
        <div
          className="chat-time"
          style={makeStyle(style.time, inlineStyle.time)}
        >
          {this.props.time}
        </div>
        <div className="chat-message-body"
          style={makeStyle(commonStyle.message, style.messagebody, inlineStyle.messagebody)}>
          <div className="chat-nickname" >
            {this.props.senderName}
          </div>
          <p className="chat-message-content" style={makeStyle(style.messagebody.messagecontent)}>
            {this.props.children}
          </p>
        </div>
      </div>
    )
  }
});

module.exports = ChatMessage;