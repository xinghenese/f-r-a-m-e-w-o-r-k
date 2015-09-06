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
var MessageStore = require('../../../stores/messagestore');
var globalEmitter = require('../../../events/globalemitter');
var groups = require('../../../datamodel/groups');
var myself = require('../../../datamodel/myself');
var users = require('../../../datamodel/users');
var EventTypes = require('../../../constants/eventtypes');
var MessageActions = require('../../../actions/messageactions');
var UserInfoBox = require('../infoview/userinfobox');

//core module to export
var ChatMessageBox = React.createClass({
    displayName: 'ChatMessageBox',
    _pendingMarkAsReadCallback: null,
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
        return _.bind(function() {
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
            this.setState({id: '', data: []});
        }, this);
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
    _updateMessages: function(info) {
        id = info && info.id || this.state.id;
        type = info && info.type || this.state.type;
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

                MessageActions.markPrivateMessagesAsRead(id);
                data = privateHistoryMessages.getMessages();
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
    componentWillMount: function() {
        var info = this.props.info;
        if (info && info.id && info.type) {
            this._updateMessages(info);
        }
    },
    componentDidMount: function() {
        MessageStore.addChangeListener(this._updateMessages);
        globalEmitter.on(EventTypes.SELECT_CONVERSATION, this._updateMessages);
        globalEmitter.on(EventTypes.ESCAPE_MESSAGE_INPUT, this._closeCurrentChat);
        this._scrollToBottom();
    },
    componentDidUpdate: function() {
        this._scrollToBottom();
    },
    componentWillUnmount: function() {
        MessageStore.removeChangeListener(this._updateMessages);
        globalEmitter.removeListener(EventTypes.SELECT_CONVERSATION, this._updateMessages);
        globalEmitter.removeListener(EventTypes.ESCAPE_MESSAGE_INPUT, this._closeCurrentChat);

        if (this._pendingMarkAsReadCallback) {
            windowFocusedRunner.cancel(this._pendingMarkAsReadCallback);
        }
    },
    render: function() {
        if (this.state.id) {
            return (
                <div className="main session messages">
                    <div className="header navigation-bar">
                        <p className="title">
                            <span className="name">{this.state.name}</span>
                            <span className="status online">Online</span>
                        </p>
                    </div>
                    <ChatMessageList className="main" ref="messagelist" data={this.state.data} />
                    <ChatMessageToolbar
                        className="footer"
                        onSubmit={this._handleSubmit}
                        inputEnabled={this.state.inputEnabled}
                        deleteHandler={this._deleteConversation(this.state.id, this.state.type)}
                        />
                </div>
            );
        }

        return (
            <div className="main welcome">
                <div className="header" />
                <div className="main"><p>{Lang.chatBoxTips}</p></div>
                <div className="footer" />
            </div>
        );
    }
});

var boxType = {
    settings: 'Settings',
    messsagebox: 'MessageBox'
};

module.exports = React.createClass({
    displayName: 'MainBox',
    getInitialState: function () {
        return {
            boxType: boxType.messsagebox,
            chatInfo: {}
        };
    },
    _showSettings: function () {
        this.setState(function (previousState) {
            if (previousState.boxType === boxType.messsagebox) {
                return {boxType: boxType.settings}
            }
            return {boxType: boxType.messsagebox, chatInfo: previousState.chatInfo};
        });
    },
    _showChatBox: function (event) {
        this.setState({boxType: boxType.messsagebox, chatInfo: event});
    },
    componentDidMount: function () {
        globalEmitter.on(EventTypes.TOGGLE_SETTINGS_SHOW, this._showSettings);
        globalEmitter.on(EventTypes.SELECT_CONVERSATION, this._showChatBox);
    },
    componentWillUnmount: function () {
        globalEmitter.removeListener(EventTypes.TOGGLE_SETTINGS_SHOW, this._showSettings);
        globalEmitter.removeListener(EventTypes.SELECT_CONVERSATION, this._showChatBox);
    },
    render: function () {
        if (this.state.boxType === boxType.settings) {
            return <UserInfoBox />;
        }
        if (this.state.boxType === boxType.messsagebox) {
            return <ChatMessageBox info={this.state.chatInfo}/>;
        }
        return null;
    }
});

//private functions
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

function _runTaskOnFocus(box, task) {
    if (box._pendingMarkAsReadCallback) {
        windowFocusedRunner.cancel(box._pendingMarkAsReadCallback);
    }
    box._pendingMarkAsReadCallback = function() {
        box._pendingMarkAsReadCallback = null;
        task.apply(box);
    };
    windowFocusedRunner.run(box._pendingMarkAsReadCallback);
}
