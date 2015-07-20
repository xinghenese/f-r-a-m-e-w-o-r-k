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
        console.log("update list");
        console.log(messages);
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
    var result = _.map(lastMessages, function(item) {
        if ("groupId" in item) {
            var group = groups.getGroup(item.groupId);
            var groupName = group.name();
            var avatar = group.picture();
            var message = item.message.getContent();
            var time = (new Date()).toLocaleTimeString();
            return {
                senderName: groupName,
                senderAvatar: avatar,
                message: message,
                time: time
            };
        }
    });
    console.log(result);
    return result;
}