/**
 * Created by kevin on 6/15/15.
 */
'use strict';

var React = require('react');
var Router = require('react-router');
var State = Router.State;
var ChatActions = require('../actions/chatactions');
var ChatStore = require('../stores/chatstore');
var GroupActioins = require('../actions/groupactions');
var ConversationBox = require('./view/conversationlistview/conversationbox');
var ChatMessageBox = require('./view/chatview/chatmessagebox');
var SocketConnection = require('../net/connection/socketconnection');
var setStyle = require('../style/styles').setStyle;

var Chat = React.createClass({
    _handleGroupsLoaded: function() {
        // todo
        GroupActioins.requestGroupMembers(708);
        SocketConnection.request({
            tag: "HM",
            data: {
                data: {
                    rmsg: {},
                    pmsg: {},
                    dmc: {}
                }
            }
        }).then(function(v) {
            console.log(v);
        });
    },
    _handleUsersLoaded: function() {
        // todo
    },
    componentWillMount: function() {
        // putting it here for test purpose
        // 1 for groups, 2 for contacts
        ChatActions.getChatList(1);
        ChatStore.on(ChatStore.Events.GROUPS_LOAD_SUCCESS, this._handleGroupsLoaded);
        ChatStore.on(ChatStore.Events.USERS_LOAD_SUCCESS, this._handleUsersLoaded);
        modifyPageStyle();
    },
    componentWillUnmount: function() {
        ChatStore.removeListener(ChatStore.Events.GROUPS_LOAD_SUCCESS, this._handleGroupsLoaded);
        ChatStore.removeListener(ChatStore.Events.USERS_LOAD_SUCCESS, this._handleUsersLoaded);
    },
    render: function() {
        return (
            <div>
                <p>{this.props.params.t}</p>
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
        width: '1000px',
        margin: '0 auto',
        background: '#fff'
    });
}