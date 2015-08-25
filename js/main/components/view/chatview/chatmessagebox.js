/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var Lang = require('../../../locales/zh-cn');
var ChatMessageList = require('./chatmessagelist');
var ChatMessageToolbar = require('./chatmessagetoolbar');
var ConversationConstants = require('../../../constants/conversationconstants');
var style = require('../../../style/chatmessage');
var makeStyle = require('../../../style/styles').makeStyle;
var MessageStore = require('../../../stores/messagestore');
var globalEmitter = require('../../../events/globalemitter');
var groups = require('../../../datamodel/groups');
var myself = require('../../../datamodel/myself');
var users = require('../../../datamodel/users');
var EventTypes = require('../../../constants/eventtypes');
var Formats = require('../../../utils/formats');
var MessageActions = require('../../../actions/messageactions');
var Button = require('../../form/control/Button');

//core module to export
var ChatMessageBox = React.createClass({
    getInitialState: function() {
        return {
            id: '',
            name: '',
            type: '',
            inputEnabled: true,
            data: []
        };
    },
    _deleteConversation: function(id, type) {
        return function() {
            var idNumber = parseInt(id);
            switch (type) {
                case ConversationConstants.GROUP_TYPE:
                    MessageActions.deleteGroupMessages(idNumber);
                    break;
                case ConversationConstants.PRIVATE_TYPE:
                    MessageActions.deletePrivateMessages(idNumber);
                    break;
                default:
                    console.error("Unknow type of conversation to delete");
                    break;
            }
        };
    },
    _handleSubmit: function(event) {
        var data = _.values(event.data)[0];
        if (this.state.id && data) {
            globalEmitter.emit(EventTypes.BEFORE_SENDING_MESSAGE);

            var roomId = null;
            var toUserId = null;
            if (this.state.type === ConversationConstants.GROUP_TYPE) {
                roomId = this.state.id;
            } else {
                toUserId = this.state.id;
            }
            MessageActions.sendTalkMessage(
                roomId,
                toUserId,
                null,
                (_.values(event.data)[0]).toString(),
                _getConversationType(this.state.type),
                0,
                "1.0"
            );
        }
    },
    _updateMessages: function(id, type) {
        id = id || this.state.id;
        type = type || this.state.type;
        if (!id || !type) {
            return;
        }

        var data = [];
        var enabled = true;
        var name;

        if (type === ConversationConstants.GROUP_TYPE) {
            var group = groups.getGroup(id);
            if (group) {
                enabled = group.inGroup();
                name = group.name();
            }

            var groupHistoryMessages = MessageStore.getGroupHistoryMessages(id);
            if (groupHistoryMessages) {
                if (!groupHistoryMessages.isRequested()) {
                    MessageActions.requestGroupHistoryMessages(id);
                }

                data = groupHistoryMessages.getMessages();
                MessageActions.markGroupMessagesAsRead(id);
            }
        } else {
            var user = users.getUser(id);
            if (user) {
                name = user.nickname();
            }

            var privateHistoryMessages = MessageStore.getPrivateHistoryMessages(id);
            if (privateHistoryMessages) {
                if (!privateHistoryMessages.isRequested()) {
                    MessageActions.requestPrivateHistoryMessages(id);
                }

                data = privateHistoryMessages.getMessages();
                MessageActions.markPrivateMessagesAsRead(id);
            }
        }

        this.setState({
            data: data,
            id: id,
            name: name,
            type: type,
            inputEnabled: enabled
        });

        _.defer(function() {
            globalEmitter.emit(EventTypes.FOCUS_MESSAGE_INPUT);
        });
    },
    _scrollToBottom: function() {
        var messageList = React.findDOMNode(this.refs.messagelist);
        if (messageList) {
            messageList.scrollTop = messageList.scrollHeight;
        }
    },
    _closeCurrentChat: function() {
        this.setState({id: '', name: ''});
    },
    _modifyCurrentChat: function() {
        globalEmitter.emit(EventTypes.MODIFY_CHAT_MESSAGES, {modifyEnable: true});
    },
    componentDidMount: function() {
        MessageStore.addChangeListener(this._updateMessages);
        addConversationListSelectedHandler(this);
        globalEmitter.on(EventTypes.ESCAPE_MESSAGE_INPUT, this._closeCurrentChat);
    },
    componentDidUpdate: function() {
        this._scrollToBottom();
    },
    componentWillUnmount: function() {
        MessageStore.removeChangeListener(this._updateMessages);
        removeConversationListSelectedHandler(this);
        globalEmitter.removeListener(EventTypes.ESCAPE_MESSAGE_INPUT, this._closeCurrentChat);
    },
    render: function() {
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
                    <ChatMessageList id="chat-message-list" ref="messagelist" data={this.state.data}
                                     style={style.chatmessagelist}/>
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
    globalEmitter.on(EventTypes.SELECT_CONVERSATION, function(info) {
        box._updateMessages(info.id, info.type);
    });
}

function removeConversationListSelectedHandler(box) {
    globalEmitter.removeAllListeners(EventTypes.SELECT_CONVERSATION);
}

function _buildGroupRenderObject(item, collector) {
    var group = groups.getGroup(item.groupId);
    if (!group) {
        return;
    }

    _.forEach(item.messages, function(message) {
        if (message) {
            collector.push(message);
        }
    });
}

function _buildUserRenderObject(item, collector) {
    var user = users.getUser(item.userId);
    if (!user) {
        return;
    }

    _.forEach(item.messages, function(message) {
        if (message) {
            collector.push(message);
        }
    });
}

function _getConversationType(strType) {
    return strType === ConversationConstants.GROUP_TYPE ? 0 : 1;
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
        return user.nickname();
    }

    return "";
}
