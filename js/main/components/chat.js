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
var UserInfoBox = require('./view/infoview/userinfobox');
var emitter = require('../utils/eventemitter');

//private fields
var boxType = {
    settings: 'Settings',
    messsagebox: 'MessageBox'
};

var RightSideBox = React.createClass({
    render: function () {
        if (this.props.boxType === boxType.settings) {
            return <UserInfoBox />;
        }
        if (this.props.boxType === boxType.messsagebox) {
            return <ChatMessageBox />;
        }
        return null;
    }
});

// exports
var Chat = React.createClass({
    getInitialState: function () {
        return {
            rightBoxType: boxType.messsagebox
        };
    },
    _handleGroupsLoaded: function () {
        MessageActions.requestHistoryMessages();
    },
    _onSelectConversation: function (data) {
        this.setState({rightBoxType: boxType.messsagebox});
        emitter.emit('select', data);
    },
    _showSettings: function () {
        this.setState(function (previousState) {
            if (previousState.rightBoxType === boxType.messsagebox) {
                return {rightBoxType: boxType.settings}
            }
            return {rightBoxType: boxType.messsagebox};
        });
    },
    componentWillMount: function () {
        // 1 for groups, 2 for contacts
        ConversationAndContactActions.getConversationAndContactList();
        AccountActions.switchStatus(1);
        ConversationAndContactStore.addChangeListener(this._handleGroupsLoaded);
        modifyPageStyle();
    },
    componentWillUnmount: function () {
        ConversationAndContactStore.removeChangeListener(this._handleGroupsLoaded);
    },
    render: function () {
        return (
            <div>
                <RightSideBox boxType={this.state.rightBoxType}/>
                <ConversationBox
                    showSettings={this._showSettings}
                    onSelectConversation={this._onSelectConversation}
                />
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
