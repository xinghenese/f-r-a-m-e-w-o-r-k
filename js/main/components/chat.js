/**
 * Created by kevin on 6/15/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var State = Router.State;
var AccountActions = require('../actions/accountactions');
var ConversationActions = require('../actions/conversationactions');
var ConversationStore = require('../stores/conversationstore');
var ConversationBox = require('./view/conversationlistview/conversationbox');
var ChatMessageBox = require('./view/chatview/chatmessagebox');
var MessageActions = require('../actions/messageactions');
var SocketConnection = require('../net/connection/socketconnection');
var myself = require('../datamodel/myself');
var setStyle = require('../style/styles').setStyle;

var UserInfoBox = require('./view/infoview/userinfobox');

// exports
var Chat = React.createClass({
    getInitialState: function() {
        return {showSettings: false};
    },
    _handleGroupsLoaded: function() {
        MessageActions.requestHistoryMessages();
    },
    _handleUsersLoaded: function() {
        // todo
    },
    _handleHistoryMessagesReceived: function() {
        var groupHistoryMessages = MessageStore.getGroupHistoryMessages(426);
        var messages = groupHistoryMessages.getMessages();
        _.forEach(messages, function(message) {
            //console.log(message);
        });
    },
    _showSettings: function() {
        console.info('chat#_showSettings');
        var newState = !this.state.showSettings;
        console.log('showSettings: ', newState);
        this.setState({showSettings: newState});
    },
    componentWillMount: function() {
        // 1 for groups, 2 for contacts
        ConversationActions.getChatList(1);
        ConversationActions.getChatList(2);
        AccountActions.switchStatus(1);
        ConversationStore.on(ConversationStore.Events.GROUPS_LOAD_SUCCESS, this._handleGroupsLoaded);
        ConversationStore.on(ConversationStore.Events.USERS_LOAD_SUCCESS, this._handleUsersLoaded);
        modifyPageStyle();
    },
    componentWillUnmount: function() {
        ConversationStore.removeListener(ConversationStore.Events.GROUPS_LOAD_SUCCESS, this._handleGroupsLoaded);
        ConversationStore.removeListener(ConversationStore.Events.USERS_LOAD_SUCCESS, this._handleUsersLoaded);
    },
    render: function() {
        var rightSideBox = null;

        console.log('chat#render showSettings: ', this.state.showSettings);

        if (this.state.showSettings) {
            rightSideBox = <UserInfoBox />;
        } else {
            rightSideBox = <ChatMessageBox />;
        }

        return (
            <div>
                {rightSideBox}
                <ConversationBox showSettings={this._showSettings} />
            </div>
        );
    }
});

module.exports = Chat;

//private functions
function modifyPageStyle() {
    setStyle(document.body.style, {background: '#e7ebf0'});
    setStyle(document.getElementById('header').style, {display: 'none'});
    setStyle(document.getElementById('content').style, {
        position: 'relative',
        width: '1000px',
        margin: '0 auto',
        background: '#fff'
    });
}
