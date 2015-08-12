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
var EventTypes = require('../../../constants/eventtypes');
var Formats = require('../../../utils/formats');
var MessageActions = require('../../../actions/messageactions');
var Button = require('../../form/control/Button');

//core module to export
var ChatMessageBox = React.createClass({
    getInitialState: function () {
        return {
            id: '',
            name: '',
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
            emitter.emit(EventTypes.BEFORE_SENDING_MESSAGE);
            MessageActions.sendTalkMessage(
                this.state.id,
                null,
                null,
                (_.values(event.data)[0]).toString(),
                _getConversationType(this.state.type),
                0,
                "1.0"
            );
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
        var name;

        if (type === 'group') {
            var groupHistoryMessages = MessageStore.getGroupHistoryMessages(id);
            if (!groupHistoryMessages) {
                this.setState({id: null});
                return;
            }

            var groupMessages = groupHistoryMessages.getMessages();
            if (groupMessages.length <= 1) {
                MessageActions.requestGroupHistoryMessages(id);
            }
            data = {
                groupId: id,
                messages: groupMessages
            };
            var group = groups.getGroup(id);
            if (group) {
                enabled = group.inGroup();
                name = group.name();
            }
        } else if (type === 'private') {
            var privateHistoryMessages = MessageStore.getPrivateHistoryMessages(id);
            if (!privateHistoryMessages) {
                this.setState({id: null});
                return;
            }

            var privateMessages = privateHistoryMessages.getMessages();
            if (privateMessages.length <= 1) {
                MessageActions.requestPrivateHistoryMessages(id);
            }
            data = {
                userId: id,
                messages: privateMessages
            };
            var user = users.getUser(id);
            if (user) {
                name = user.name();
            }
        }

        if (!data) {
            return;
        }

        var result = [];
        if ("groupId" in data) {
            _buildGroupRenderObject(data, result);
        } else {
            _buildUserRenderObject(data, result);
        }

        this.setState({
            data: result,
            id: id,
            name: name,
            type: type,
            inputEnabled: enabled
        });

        _.defer(function() {
            emitter.emit(EventTypes.FOCUS_MESSAGE_INPUT);
        });
    },
    _scrollToBottom: function () {
        var messageList = React.findDOMNode(this.refs.messagelist);
        if (messageList) {
            messageList.scrollTop = messageList.scrollHeight;
        }
    },
    _closeCurrentChat: function () {
        this.setState({id: '', name: ''});
    },
    _modifyCurrentChat: function () {
        emitter.emit(EventTypes.MODIFY_CHAT_MESSAGES, {modifyEnable: true});
    },
    componentDidMount: function () {
        MessageStore.addChangeListener(this._updateMessages);
        addConversationListSelectedHandler(this);
        emitter.on(EventTypes.ESCAPE_MESSAGE_INPUT, this._closeCurrentChat);
    },
    componentDidUpdate: function () {
        this._scrollToBottom();
    },
    componentWillUnmount: function () {
        MessageStore.removeChangeListener(this._updateMessages);
        removeConversationListSelectedHandler(this);
        emitter.removeListener(EventTypes.ESCAPE_MESSAGE_INPUT, this._closeCurrentChat);
    },
    render: function () {
        if (this.state.id) {
            return (
                <div className="chat-message-box" style={makeStyle(style)}>
                    <div className="chat-message-box-header" style={makeStyle(style.header)}>
                        <Button
                            value={Lang.close}
                            style={makeStyle(style.header.button, style.header.button.close)}
                            onClick={this._closeCurrentChat}
                        />
                        <span>{this.state.name}</span>
                        <Button
                            value={Lang.modify}
                            style={makeStyle(style.header.button, style.header.button.modify)}
                            onClick={this._modifyCurrentChat}
                        />
                    </div>
                    <ChatMessageList id="chat-message-list" ref="messagelist" data={this.state.data} style={style.chatmessagelist}/>
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
                <div className="chat-message-box-footer" style={makeStyle(style.footer)}/>
            </div>
        );
    }
});

module.exports = ChatMessageBox;

//private functions
function addConversationListSelectedHandler(box) {
    emitter.on(EventTypes.SELECT_CONVERSATION, function (info) {
        box._updateMessages(info.id, info.type);
    });
}

function removeConversationListSelectedHandler(box) {
    emitter.removeAllListeners(EventTypes.SELECT_CONVERSATION);
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
            senderId: message.getUserId(),
            senderName: _getSenderNickname(message),
            senderAvatar: avatar,
            message: messageContent,
            time: time,
            type: 'group'
        });
    });
}

function _buildUserRenderObject(item, collector) {
    var user = users.getUser(item.userId);
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
            senderId: message.getUserId(),
            senderName: message.getUserNickname() || 'myself',
            senderAvatar: avatar,
            message: messageContent,
            time: time,
            type: 'group'
        });
    });
}

function _getConversationType(strType) {
    return strType === "group" ? 0 : 1;
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
