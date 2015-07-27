/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var ConversationList = require('./conversationlist');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
var Search = require('../../tools/Search');
var Lang = require('../../../locales/zh-cn');
var groups = require('../../../datamodel/groups');
var users = require('../../../datamodel/users');
var MessageActions = require('../../../actions/messageactions');
var MessageStore = require('../../../stores/messagestore');
var Formats = require('../../../utils/formats');

var ContactList = require('./ContactList');
var ContactStore = require('../../../stores/contactstore');
var Switcher = require('./conversationuserswitcher');

//private fields
var listType = {
    conversation: 'conversation',
    contacts: 'contacts'
};

//core module to export
var ConversationBox = React.createClass({
    getInitialState: function() {
        var messages = _getLastMessages();
        return {
            data: messages,
            displayData: messages,
            matchedMessages: null,
            type: listType.conversation
        };
    },
    _switchList: function(type) {
        this.setState({type: listType[type] || listType.conversation});
    },
    _filterData: function(data) {
        console.log('data: ', data);
        this.setState({
            displayData: data && _.indexBy(data.name, 'id') || this.state.data,
            matchedMessages: data && data.message
        });
    },
    _updateMessages: function() {
        var messages = _getLastMessages();
        this.setState({
            data: messages,
            displayData: messages
        });
    },
    componentWillMount: function() {
        MessageStore.addChangeListener(this._updateMessages);
    },
    componentWillUnmount: function() {
        MessageStore.removeChangeListener(this._updateMessages);
    },
    render: function() {
        var matchedMessages = null;
        var matchedMessagesCount = null;
        var list = null;

        if (this.state.matchedMessages) {
            matchedMessagesCount = (
                <div
                    className="conversation-list-matchedmessages-gap"
                    style={style.gap}
                >
                    found {_.size(this.state.matchedMessages)} messages
                </div>
            );
            matchedMessages = (
                <ConversationList data={this.state.matchedMessages} />
            )
        }

        if (this.state.type === listType.contacts) {
            list = (<ContactList data={ContactStore} />);
        } else if (this.state.type === listType.conversation) {
            list = (<ConversationList data={this.state.displayData} />);
        }

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
                            style={style.header.searchbar.search}
                            />
                    </div>
                </div>

                <div
                    className="conversation-list-container"
                    style={style.body}
                >
                    {list}
                    {matchedMessagesCount}
                    {matchedMessages}
                </div>

                <div className="conversation-list-box-footer"
                     style={makeStyle(style.footer)}
                >
                    <Switcher onSwitch={this._switchList}/>
                </div>
            </div>
        )
    }
});

module.exports = ConversationBox;

//private functions
function _getLastMessages() {
    var lastMessages = MessageStore.getLastMessages();
    var result = {};
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
    _.set(collector, item.groupId, {
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
    _.set(collector, item.userId, {
        name: userName,
        senderName: userName,
        senderAvatar: avatar,
        message: message,
        time: time,
        id: item.userId,
        type: 'private'
    });
}