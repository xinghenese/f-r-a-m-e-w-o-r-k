/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var Lang = require('../../../locales/zh-cn');
var ChatMessageList = require('./chatmessagelist');
var ChatMessageToolbar = require('./chatmessagetoolbar');
var style = require('../../../style/chatmessage');
var makeStyle = require('../../../style/styles').makeStyle;
var MessageStore = require('../../../stores/messagestore');
var emitter = require('../../../utils/eventemitter');
var groups = require('../../../datamodel/groups');
var users = require('../../../datamodel/users');
var Formats = require('../../../utils/formats');

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
              data = {
                  groupId: info.id,
                  messages: MessageStore.getGroupHistoryMessages(info.id).getMessages()
              };
          } else if (info.type === 'private') {
              data = {
                  userId: info.id,
                  messages: MessageStore.getPrivateHistoryMessages(info.id).getMessages()
              };
          }

          var result = [];
          if ("groupId" in data) {
              _buildGroupRenderObject(data, result);
          } else {
              _buildUserRenderObject(data, result);
          }

          if (!_.isEmpty(result)) {
              self.setState({data: result});
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

//private functions
function _buildGroupRenderObject(item, collector) {
    var group = groups.getGroup(item.groupId);
    if (!group) {
        return;
    }
    var groupName = group.name();
    var avatar = group.picture();
    var messageContent = "";
    var time = "";

    _.forEach(item.messages, function(message) {
        if (message) {
            messageContent = message.getContent();
            time = Formats.formatTime(message.getTimestamp());
        }
        collector.push({
            senderName: message.getUserNickname() || 'myself',
            senderAvatar: avatar,
            message: messageContent,
            time: time,
            type: 'group'
        });
    });
}

function _buildUserRenderObject(item, collector) {
    if (!user) {
        return;
    }
    var userName = user.getNickname();
    var avatar = user.picture();
    var messageContent = "";
    var time = "";

    _.forEach(item.messages, function(message) {
        if (message) {
            messageContent = message.getContent();
            time = Formats.formatTime(message.getTimestamp());
        }
        collector.push({
            senderName: message.getUserNickname() || 'myself',
            senderAvatar: avatar,
            message: messageContent,
            time: time,
            type: 'group'
        });
    });
}