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

//core module to export
var ConversationBox = React.createClass({
    getInitialState: function() {
        var messages = _getLastMessages();
        return {
            data: messages,
            displayData: messages
        };
    },
    _filterData: function(data) {
        if (data) {
            this.setState({displayData: data.name});
        }
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
                <ConversationList data={this.state.displayData}/>

                <div className="conversation-list-box-footer"
                     style={makeStyle(style.footer)}>
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