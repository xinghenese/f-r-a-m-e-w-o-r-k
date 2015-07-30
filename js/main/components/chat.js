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
var ConversationAndContactActions = require('../actions/conversationandcontactactions');
var ConversationAndContactStore = require('../stores/conversationandcontactstore');
var ConversationBox = require('./view/conversationlistview/conversationbox');
var ChatMessageBox = require('./view/chatview/chatmessagebox');
var MessageActions = require('../actions/messageactions');
var SocketConnection = require('../net/connection/socketconnection');
var myself = require('../datamodel/myself');
var setStyle = require('../style/styles').setStyle;

// exports
var Chat = React.createClass({
    _handleGroupsLoaded: function() {
        console.log("requesting history messages");
        MessageActions.requestHistoryMessages();
    },
    componentWillMount: function() {
        // 1 for groups, 2 for contacts
        ConversationAndContactActions.getConversationAndContactList();
        AccountActions.switchStatus(1);
        ConversationAndContactStore.addChangeListener(this._handleGroupsLoaded);
        modifyPageStyle();
    },
    componentWillUnmount: function() {
        ConversationAndContactStore.removeChangeListener(this._handleGroupsLoaded);
    },
    render: function() {
        return (
            <div>
                <ChatMessageBox />
                <ConversationBox />
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
