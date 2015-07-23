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
var MessageStore = require('../../../stores/messagestore');
var emitter = require('../../../utils/eventemitter');

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
      var self = this;
      emitter.on('select', function(info) {
          var data;

          if (info.type === 'group') {
              data = MessageStore.getGroupHistoryMessages(info.id);
          } else if (info.type === 'private') {
              data = MessageStore.getPrivateHistoryMessages(info.id);
          }

          if (data) {
              self.setState({data: data});
          }
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