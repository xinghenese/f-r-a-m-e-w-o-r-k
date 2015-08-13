/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var ConversationList = require('./conversationlist');
var emitter = require('../../../utils/eventemitter');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
var EventTypes = require('../../../constants/eventtypes');
var KeyCodes = require('../../../constants/keycodes');
var Search = require('../../tools/Search');
var Lang = require('../../../locales/zh-cn');
var groups = require('../../../datamodel/groups');
var users = require('../../../datamodel/users');
var MessageActions = require('../../../actions/messageactions');
var MessageStore = require('../../../stores/messagestore');
var Formats = require('../../../utils/formats');

var ContactList = require('./contactlist');
var ConversationAndContactStore = require('../../../stores/conversationandcontactstore');
var Switcher = require('./conversationuserswitcher');
var Settings = require('../../tools/Settings');

//private fields
var listType = {
    conversation: 'conversation',
    contacts: 'contacts'
};

var SEARCH_FIELDS = [
    "name",
    "message"
];

var SideList = React.createClass({
    displayName: 'SideList',
    getInitialState: function () {
        return {
            listType: this.props.initialListType,
            displayData: this.props.initialData,
            matchedMessages: null
        }
    },
    _updateSql: function (event) {
        this.setState({
            displayData: event.displayData,
            matchedMessages: event.matchedMessages,
            listType: event.type
        });
    },
    componentDidMount: function () {
        //emitter.on(EventTypes.SWITCH_CONVERSATIONS_OR_CONTACTS, this._switchListType);
        emitter.on('search', this._updateSql);
    },
    componentWillUnmount: function () {
        //emitter.removeListener(EventTypes.SWITCH_CONVERSATIONS_OR_CONTACTS, this._switchListType);
        emitter.removeListener('search', this._updateSql);
    },
    render: function () {
        var matchedMessageList = null;
        var matchedMessagesCountNode = null;
        var mainList = null;

        var matchedMessages = this.state.matchedMessages;

        if (matchedMessages && !_.isEmpty(matchedMessages)) {
            matchedMessagesCountNode = (
                <div
                    className="conversation-list-matched-messages-gap"
                    style={style.gap}
                    >
                    found {_.size(matchedMessages)} messages
                </div>
            );
            matchedMessageList = (
                <ConversationList data={matchedMessages}/>
            );
        }

        if (this.state.listType === listType.conversation) {
            mainList = <ConversationList data={this.state.displayData} />;
        } else if (this.state.listType === listType.contacts) {
            mainList = <ContactList data={this.state.displayData} />;
        }

        return (
            <div
                className={this.props.className || "conversation-list-container"}
                style={style.body}
                >
                {mainList}
                {matchedMessagesCountNode}
                {matchedMessageList}
            </div>
        )
    }
});

//core module to export
var ConversationBox = React.createClass({
    getInitialState: function() {
        var messages = _getLastMessages();
        return {
            data: messages,
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
                emitter.emit(EventTypes.SELECT_FIRST_CONVERSATION);
                break;
        }
    },
    _filterData: function(data) {
        emitter.emit('search', {
            displayData: data && data.name || this.state.data,
            matchedMessages: data && data.message,
            type: this.state.type
        });
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
            data: data
        });
    },
    _onGroupsAndContactsChanged: function() {
        if (this.state.type === listType.conversation) {
            return;
        }

        this.setState({
            data: ConversationAndContactStore.getGroupsAndContacts()
        });
    },
    _updateMessages: function() {
        if (this.state.type === listType.contacts) {
            return;
        }

        this.setState({
            data: _getLastMessages()
        });
    },
    componentDidMount: function() {
        ConversationAndContactStore.addChangeListener(this._onGroupsAndContactsChanged);
        MessageStore.addChangeListener(this._updateMessages);
        emitter.on(EventTypes.ESCAPE_MESSAGE_INPUT, this._focusSearchInput);
        emitter.on(EventTypes.BEFORE_SENDING_MESSAGE, this._beforeSendingMessage);
        emitter.on(EventTypes.SWITCH_CONVERSATIONS_OR_CONTACTS, this._switchList);
    },
    componentWillUnmount: function() {
        ConversationAndContactStore.removeChangeListener(this._onGroupsAndContactsChanged);
        MessageStore.removeChangeListener(this._updateMessages);
        emitter.removeListener(EventTypes.ESCAPE_MESSAGE_INPUT, this._focusSearchInput);
        emitter.removeListener(EventTypes.BEFORE_SENDING_MESSAGE, this._beforeSendingMessage);
        emitter.removeListener(EventTypes.SWITCH_CONVERSATIONS_OR_CONTACTS, this._switchList);
    },
    render: function() {
        return (
            <div className="conversation-list-box" style={makeStyle(style)}>
                <div className="conversation-list-box-header"
                     style={makeStyle(style.header)}
                    >
                    <div
                        className="conversation-list-search"
                        style={makeStyle(style.header.searchbar)}
                        >
                        <Search
                            defaultValue={Lang.search}
                            datasource={this.state.data}
                            fields={['name', 'message']}
                            onSearch={this._filterData}
                            onKeyDown={this._onKeyDownInSearchBox}
                            style={style.header.searchbar.search}
                            caseSensitive={false}
                            ref="search"
                            />
                        <Settings
                            className="conversation-list-settings"
                            onSettings={this.props.showSettings}
                            style={style.header.searchbar.settings}
                            />
                    </div>
                </div>

                <SideList
                    initialData={this.state.data}
                    initialListType={listType.conversation}
                    />

                <div className="conversation-list-box-footer"
                     style={makeStyle(style.footer)}
                    >
                    <Switcher data={listType}/>
                </div>
            </div>
        )
    }
});

module.exports = ConversationBox;

//private functions
function _getLastMessages() {
    var lastMessages = MessageStore.getLastMessages();
    var result = [];
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
        message = item.message.getBriefText();
        time = Formats.formatTime(item.message.getTimestamp());
    }
    collector.push({
        name: groupName,
        senderName: groupName,
        senderAvatar: avatar,
        message: message,
        time: time,
        id: item.groupId,
        type: 'group'
    });
}

function _buildUserRenderObject(item, collector) {
    var user = users.getUser(item.userId);
    if (!user) {
        return;
    }
    var userName = user.getNickname();
    var avatar = user.picture();
    var message = "";
    var time = "";
    if (item.message) {
        message = item.message.getBriefText();
        time = Formats.formatTime(item.message.getTimestamp());
    }
    collector.push({
        name: userName,
        senderName: userName,
        senderAvatar: avatar,
        message: message,
        time: time,
        id: item.userId,
        type: 'user'
    });
}

function _search(data, fields, searchText) {
    return _.filter(data, function(item) {
        var len = fields.length;
        for (var i = 0; i < len; ++i) {
            var field = fields[i];
            if (item[field] && item[field].toString().toLowerCase().indexOf(searchText) > -1) {
                return true;
            }
        }
        return false;
    });
}
