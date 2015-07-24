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
var MessageActions = require('../../../actions/messageactions');

//core module to export
var ChatMessageBox = React.createClass({
    getInitialState: function(){
        return {
            id: '',
            type: '',
            data: []
        };
    },
    _handleSubmit: function(event) {
        var data = _.values(event.data)[0];
        if (this.state.id && data) {
            MessageActions.sendTalkMessage(this.state.id, null, null, (_.values(event.data)[0]).toString(), 1, 0, "1.0");
        }

    },
    _updateMessages: function(id, type) {
        id = id || this.state.id;
        type = type || this.state.type;

        var data;

        if (!id || !type) {
            return;
        }

        if (type === 'group') {
            data = {
                groupId: id,
                messages: MessageStore.getGroupHistoryMessages(id).getMessages()
            };
        } else if (info.type === 'private') {
            data = {
                userId: id,
                messages: MessageStore.getPrivateHistoryMessages(id).getMessages()
            };
        }

        var result = [];
        if ("groupId" in data) {
            _buildGroupRenderObject(data, result);
        } else {
            _buildUserRenderObject(data, result);
        }

        if (!_.isEmpty(result)) {
            this.setState({data: result, id: id, type: type});
        }
    },
    componentWillMount: function() {
        MessageStore.addChangeListener(this._updateMessages);
        addConversationListSelectedHandler(this);
    },
    componentWillUnmount: function() {
        MessageStore.removeChangeListener(this._updateMessages);
        removeConversationListSelectedHandler(this);
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
function addConversationListSelectedHandler(box) {
    emitter.on('select', function(info) {
        box._updateMessages(info.id, info.type);
    });
}

function removeConversationListSelectedHandler(box) {
    emitter.removeListener('select');
}

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