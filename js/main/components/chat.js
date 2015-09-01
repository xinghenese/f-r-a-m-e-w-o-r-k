/**
 * Created by kevin on 6/15/15.
 */
'use strict';

// dependencies
require('../style/main.css');

var _ = require('lodash');
var React = require('react');
var AccountActions = require('../actions/accountactions');
var ConversationAndContactActions = require('../actions/conversationandcontactactions');
var ConversationAndContactStore = require('../stores/conversationandcontactstore');
var SideBox = require('./view/conversationlistview/conversationbox');
var MainBox = require('./view/chatview/chatmessagebox');
var EventTypes = require('../constants/eventtypes');
var MessageActions = require('../actions/messageactions');
var AccountStore = require('../stores/accountstore');

// exports
var Chat = React.createClass({
    _checkLogin: function () {
        var hasLogIn = AccountStore.getLoginState() === AccountStore.LoginState.SUCCESS;
        if (!hasLogIn) {
            this.props.onBeforeEnterChat();
        }
        return hasLogIn;
    },
    _handleGroupsLoaded: function () {
        MessageActions.requestHistoryMessages();
    },
    componentDidMount: function() {
        ConversationAndContactStore.addChangeListener(this._handleGroupsLoaded);
    },
    componentWillMount: function () {
        console.log('Chat#WillMount');
        if (this._checkLogin()) {
            // 1 for groups, 2 for contacts
            ConversationAndContactActions.getConversationAndContactList();
            AccountActions.switchStatus(1);
        }
    },
    componentWillUnmount: function () {
        ConversationAndContactStore.removeChangeListener(this._handleGroupsLoaded);
    },
    render: function () {
        return <div className="main"><SideBox /><MainBox /></div>;
    }
});

module.exports = Chat;
