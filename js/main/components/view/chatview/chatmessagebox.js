/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var React = require('react');
var Lang = require('../../../locales/zh-cn');
var ChatMessageList = require('./chatmessagelist');
var ChatMessageToolbar = require('./chatmessagetoolbar');
var style = require('../../../style/chatmessage');
var makeStyle = require('../../../style/styles').makeStyle;

//core module to export
var ChatMessageBox = React.createClass({
  getInitialState: function(){
    return {
      data: []
    };
  },
  _handleSubmit: function(event) {
    console.log('event.data: ', event.data);
    this.setState(function(previousState) {
      previousState.data.push({
        senderName: 'reco',
        senderAvatar: '',
        message: event.data,
        time: (new Date()).toLocaleTimeString()
      });
      return previousState;
    });
  },
  componentWillMount: function() {
    this.setState(function(previousState) {
      previousState.data.push({
        senderName: 'xinghenese',
        senderAvatar: '',
        message: 'event.data',
        time: (new Date()).toLocaleTimeString()
      }, {
        senderName: 'kim',
        senderAvatar: '',
        message: 'ok，3Q &lt;br/&gt; HTTP API 协议文档 上能否写下',
        time: (new Date()).toLocaleTimeString()
      });
      return previousState;
    });
  },
  render: function(){
    return (
      <div className="chat-message-box" style={makeStyle(style)}>
        <div className="chat-message-box-header" style={makeStyle(style.header)}/>
        <ChatMessageList data={this.state.data} style={style.chatmessagelist}/>
        <ChatMessageToolbar onSubmit={this._handleSubmit} style={style.toolbar}/>
      </div>
    );
  }
});

module.exports = ChatMessageBox;