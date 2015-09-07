/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var classNames = require('classnames');
var SideList = require('./conversationlist');
var globalEmitter = require('../../../events/globalemitter');
var EventTypes = require('../../../constants/eventtypes');
var KeyCodes = require('../../../constants/keycodes');
var Search = require('../../tools/Search');
var Lang = require('../../../locales/zh-cn');
var groups = require('../../../datamodel/groups');
var users = require('../../../datamodel/users');
var ConversationConstants = require('../../../constants/conversationconstants');
var MessageActions = require('../../../actions/messageactions');
var MessageStore = require('../../../stores/messagestore');
var ConversationAndContactStore = require('../../../stores/conversationandcontactstore');
var Switcher = require('./conversationuserswitcher');
var Settings = require('../../tools/Settings');
var strings = require('../../../utils/strings');

//private fields
var listType = {
    conversation: 'conversation',
    contact: 'contact'
};

//core module to export
var ConversationBox = React.createClass({
    getInitialState: function() {
        var messages = _getLastMessages();
        return {
            store: messages,
            displayData: messages,
            matchedMessages: null,
            type: listType.conversation
        };
    },
    _beforeSendingMessage: function() {
        this.refs.search.clear();
    },
    _focusSearchInput: function() {
        this.refs.search.focus();
    },
    _onKeyDownInSearchBox: function(event) {
        switch (event.keyCode) {
            case KeyCodes.ESCAPE:
                if (!_.isEmpty(event.target.value)) {
                    this.refs.search.clear();
                }
                break;
            case KeyCodes.DOWN:
                globalEmitter.emit(EventTypes.SELECT_FIRST_CONVERSATION);
                break;
        }
    },
    _filterData: function(data) {
        this.setState({
            displayData: data && data.name || this.state.store,
            matchedMessages: data && data.message,
            type: this.state.type
        })
    },
    _switchList: function(event) {
        var newType = listType[event.option] || listType.conversation;
        var data;

        if (newType === listType.conversation) {
            data = _getLastMessages();
        } else {
            data = ConversationAndContactStore.getGroupsAndContacts();
        }

        this.setState({
            type: newType,
            store: data
        });
    },
    _onShowSettings: function () {
        globalEmitter.emit(EventTypes.TOGGLE_SETTINGS_SHOW);
    },
    _onGroupsAndContactsChanged: function() {
        if (this.state.type === listType.contact) {
            this.setState({
                store: ConversationAndContactStore.getGroupsAndContacts()
            });
        }
    },
    _updateMessages: function() {
        if (this.state.type === listType.conversation) {
            this.setState({
                store: _getLastMessages()
            });
        }
    },
    componentDidMount: function() {
        ConversationAndContactStore.addChangeListener(this._onGroupsAndContactsChanged);
        MessageStore.addChangeListener(this._updateMessages);
        globalEmitter.on(EventTypes.ESCAPE_MESSAGE_INPUT, this._focusSearchInput);
        globalEmitter.on(EventTypes.BEFORE_SENDING_MESSAGE, this._beforeSendingMessage);
        globalEmitter.on(EventTypes.SWITCH_CONVERSATIONS_OR_CONTACTS, this._switchList);
    },
    componentWillUnmount: function() {
        ConversationAndContactStore.removeChangeListener(this._onGroupsAndContactsChanged);
        MessageStore.removeChangeListener(this._updateMessages);
        globalEmitter.removeListener(EventTypes.ESCAPE_MESSAGE_INPUT, this._focusSearchInput);
        globalEmitter.removeListener(EventTypes.BEFORE_SENDING_MESSAGE, this._beforeSendingMessage);
        globalEmitter.removeListener(EventTypes.SWITCH_CONVERSATIONS_OR_CONTACTS, this._switchList);
    },
    render: function() {
        console.info('store: ', this.state.store);
        return (
            <div className="sidebar">
                <div className="header">
                    <Search className="search" placeholder={Lang.search} datasource={this.state.store}
                            fields={['name', 'message']} caseSensitive={false} ref="search"
                            onSearch={this._filterData} onKeyDown={this._onKeyDownInSearchBox} />
                    <input type="button" className="settings" onClick={this._onShowSettings} />
                </div>
                <SideList className="main" isContacts={this.state.type === listType.contact && _.isEmpty(this.state.matchedMessages)}
                          data={{data: this.state.displayData, messages: this.state.matchedMessages}}/>
                <Switcher className="footer tabs" data={listType} unreadCount={MessageStore.getUnreadCount()}/>
            </div>
        )
    }
});

module.exports = ConversationBox;

//private functions
function _getLastMessages() {
    var lastMessages = MessageStore.getLastMessages();
    var result = [];
    console.info('lastMessages: ', lastMessages);
    _.forEach(lastMessages, function(item) {
        if ("groupId" in item) {
            _buildGroupRenderObject(item, result);
        } else {
            _buildUserRenderObject(item, result);
        }
    });
    return result;
}

function _buildGroupRenderObject(item, collector) {
    var group = groups.getGroup(item.groupId);
    if (!group) {
        return;
    }
    var groupName = group.name();
    var avatar = group.picture();
    var message = "";
    var time = "";
    if (item.message) {
        message = strings.format("{0}{1}{2}", item.message.getUserNickname(),
            Lang.separatorBetweenNameAndMessage, item.message.getBriefText());
        time = new Date(item.message.getTimestamp());
    }

    var history = MessageStore.getGroupHistoryMessages(item.groupId);
    var unreadCount = history ? history.getTotalUnreadCount() : 0;
    collector.push({
        name: groupName,
        senderName: groupName,
        senderAvatar: avatar,
        message: message,
        time: time,
        unreadCount: unreadCount,
        id: item.groupId,
        type: ConversationConstants.GROUP_TYPE
    });
    console.info('collector: ', collector);
}

function _buildUserRenderObject(item, collector) {
    var user = users.getUser(item.userId);
    if (!user) {
        return;
    }
    var userName = user.nickname();
    var avatar = user.picture();
    var message = "";
    var time = "";
    if (item.message) {
        message = item.message.getBriefText();
        time = new Date(item.message.getTimestamp());
    }

    var history = MessageStore.getPrivateHistoryMessages(item.userId);
    var unreadCount = history ? history.getTotalUnreadCount() : 0;
    collector.push({
        name: userName,
        senderName: userName,
        senderAvatar: avatar,
        message: message,
        time: time,
        unreadCount: unreadCount,
        id: item.userId,
        type: ConversationConstants.PRIVATE_TYPE
    });
    console.info('collector: ', collector);
}
