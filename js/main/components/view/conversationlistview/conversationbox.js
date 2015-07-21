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
var MessageStore = require('../../../stores/messagestore');

//core module to export
var ConversationBox = React.createClass({
    getInitialState: function() {
        return {
            data: _getLastMessages()
        };
    },
    _updateMessages: function() {
        var messages = _getLastMessages();
        this.setState({
            data: messages
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
                            style={style.header.searchbar.search}
                            />
                    </div>
                </div>
                <ConversationList data={this.state.data}/>

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
    if (item.message) {
        message = item.message.getContent();
    }
    var time = (new Date()).toLocaleTimeString();
    collector.push({
        senderName: groupName,
        senderAvatar: avatar,
        message: message,
        time: time
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
    if (item.message) {
        message = item.message.getContent();
    }
    var time = (new Date()).toLocaleTimeString();
    collector.push({
        senderName: userName,
        senderAvatar: avatar,
        message: message,
        time: time
    });
}