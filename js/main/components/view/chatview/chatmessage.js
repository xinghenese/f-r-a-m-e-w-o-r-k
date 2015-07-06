/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var React = require('react');
var style = require('../../../style/chatmessage');
var makeStyle = require('../../../style/styles').makeStyle;

//core module to export
var ChatMessage =  React.createClass({
  render: function(){
    return (
      <div className="chat-message">
        <a
          className="chat-avatar"
          style={makeStyle(style.chatmessage.avatar)}
        >
          <img
            alt={this.props.senderName}
            src={this.props.senderAvatar}
          />
        </a>
        <div
          className="chat-time"
          style={makeStyle(style.chatmessage.time)}
        >
          {this.props.time}
        </div>
        <div className="chat-message-body">
          <div className="chat-nickname" >
            {this.props.senderName}
          </div>
          <p className="chat-message-content">
            {this.props.children}
          </p>
        </div>
      </div>
    )
  }
});

module.exports = ChatMessage;