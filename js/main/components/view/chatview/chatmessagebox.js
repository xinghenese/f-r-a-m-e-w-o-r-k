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
var myself = require('../../../datamodel/myself');
var users = require('../../../datamodel/users');
var Formats = require('../../../utils/formats');
var MessageActions = require('../../../actions/messageactions');

//core module to export
var ChatMessageBox = React.createClass({
    getInitialState: function () {
        return {
            id: '',
            type: '',
            inputEnabled: true,
            data: []
        };
    },
    _deleteConversation: function (id, type) {
        return function () {
            var idNumber = parseInt(id);
            switch (type) {
                case "group":
                    MessageActions.deleteGroupMessages(idNumber);
                    break;
                case "private":
                    MessageActions.deletePrivateMessages(idNumber);
                    break;
                default:
                    console.error("Unknow type of conversation to delete");
                    break;
            }
        };
    },
    _handleSubmit: function (event) {
        var data = _.values(event.data)[0];
        if (this.state.id && data) {
            MessageActions.sendTalkMessage(this.state.id, null, null, (_.values(event.data)[0]).toString(), 1, 0, "1.0");
        }
    },
    _updateMessages: function (id, type) {
        id = id || this.state.id;
        type = type || this.state.type;
        if (!id || !type) {
            return;
        }

        var data;
        var enabled = true;
        if (type === 'group') {
            var groupHistoryMessages = MessageStore.getGroupHistoryMessages(id);
            if (!groupHistoryMessages) {
                this.setState({id: null});
                return;
            }

            data = {
                groupId: id,
                messages: groupHistoryMessages.getMessages()
            };
            var group = groups.getGroup(id);
            if (group) {
                enabled = group.inGroup();
            }
        } else if (type === 'private') {
            var privateHistoryMessages = MessageStore.getPrivateHistoryMessages(id);
            if (!privateHistoryMessages) {
                this.setState({id: null});
                return;
            }

            data = {
                userId: id,
                messages: privateHistoryMessages.getMessages()
            };
        }

        var result = [];
        if ("groupId" in data) {
            _buildGroupRenderObject(data, result);
        } else {
            _buildUserRenderObject(data, result);
        }

        this.setState({data: result, id: id, type: type, inputEnabled: enabled});
    },
    componentWillMount: function () {
        MessageStore.addChangeListener(this._updateMessages);
        addConversationListSelectedHandler(this);
    },
    componentWillUnmount: function () {
        MessageStore.removeChangeListener(this._updateMessages);
        removeConversationListSelectedHandler(this);
    },
    render: function () {
        if (this.state.id) {
            return (
                <div className="chat-message-box" style={makeStyle(style)}>
                    <div className="chat-message-box-header" style={makeStyle(style.header)}/>
                    <ChatMessageList data={this.state.data} style={style.chatmessagelist}/>
                    <ChatMessageToolbar
                        onSubmit={this._handleSubmit}
                        inputEnabled={this.state.inputEnabled}
                        deleteHandler={this._deleteConversation(this.state.id, this.state.type)}
                        style={style.toolbar}
                        />
                </div>
            );
        }

        return (
            <div className="chat-message-box" style={makeStyle(style)}>
                <div className="chat-message-box-header" style={makeStyle(style.header)}/>
                <div style={style.chattips}>{Lang.chatBoxTips}</div>
                <div className="chat-message-box-header" style={makeStyle(style.footer)}/>
            </div>
        );
    }
});

module.exports = ChatMessageBox;

//private functions
function addConversationListSelectedHandler(box) {
    emitter.on('select', function (info) {
        box._updateMessages(info.id, info.type);
    });
}

function removeConversationListSelectedHandler(box) {
    emitter.removeAllListeners('select');
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

    _.forEach(item.messages, function (message) {
        if (!message) {
            return;
        }

        messageContent = message.getContent();
        time = Formats.formatTime(message.getTimestamp());
        collector.push({
            senderName: _getSenderNickname(message),
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

    _.forEach(item.messages, function (message) {
        if (!message) {
            return;
        }

        messageContent = message.getContent();
        time = Formats.formatTime(message.getTimestamp());
        collector.push({
            senderName: message.getUserNickname() || 'myself',
            senderAvatar: avatar,
            message: messageContent,
            time: time,
            type: 'group'
        });
    });
}

function _getSenderNickname(message) {
    if (message.getUserNickname()) {
        return message.getUserNickname();
    }

    var userId = message.getUserId();
    if (userId === myself.uid) {
        return myself.nickname;
    }

    var user = users.getUser(userId);
    if (user) {
        return user.getNickname();
    }

    return "";
}
