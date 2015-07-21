/**
 * Created by kevin on 6/15/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var State = Router.State;
var ChatActions = require('../actions/chatactions');
var ChatStore = require('../stores/chatstore');
var GroupActioins = require('../actions/groupactions');
var MessageActions = require('../actions/messageactions');
var MessageStore = require('../stores/messagestore');
var SocketConnection = require('../net/connection/socketconnection');
var myself = require('../datamodel/myself');
var setStyle = require('../style/styles').setStyle;
var Lang = require('../locales/zh-cn');
var Page  = require('./hierarchy/Page');
var DataHolder = require('./hierarchy/DataHolder');
var Search = require('./tools/Search');
var ConversationList = require('./view/conversationlistview/conversationlist');
var ChatMessageList = require('./view/chatview/chatmessagelist');
var ConversationAndUserStore = require('../stores/ConversationAndUserStore');

// exports
var Chat = React.createClass({
    _handleGroupsLoaded: function() {
        // todo
        // for test
        GroupActioins.requestGroupMembers(708);
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
        MessageActions.sendTalkMessage(null, "100", null, "1", 1, 0, "1.0");
    },
    componentWillMount: function() {
        // putting it here for test purpose
        // 1 for groups, 2 for contacts
        ChatActions.getChatList(1);
        ChatStore.on(ChatStore.Events.GROUPS_LOAD_SUCCESS, this._handleGroupsLoaded);
        ChatStore.on(ChatStore.Events.USERS_LOAD_SUCCESS, this._handleUsersLoaded);
        MessageStore.on(MessageStore.Events.HISTORY_MESSAGES_RECEIVED, this._handleHistoryMessagesReceived);
        modifyPageStyle();
    },
    componentWillUnmount: function() {
        ChatStore.removeListener(ChatStore.Events.GROUPS_LOAD_SUCCESS, this._handleGroupsLoaded);
        ChatStore.removeListener(ChatStore.Events.USERS_LOAD_SUCCESS, this._handleUsersLoaded);
        MessageStore.removeListener(MessageStore.Events.HISTORY_MESSAGES_RECEIVED, this._handleHistoryMessagesReceived);
    },
    render: function() {
        var data = _.get(ConversationAndUserStore, 'ConversationStore');
        var style = {
            conversationBox: require('../style/conversationlist'),
            chatBox: require('../style/chatmessage')
        };
        return (
            <Page className="chat" store={data} namespace="chat" style={style}>
                <DataHolder
                    handler={Search}
                    props={{defaultValue: Lang.search}}
                    updateHook={'onChange'}
                    domPath={'/div#SideList.conversation-box/div.header/div.searchbar'}
                >
                    <DataHolder
                        handler={ConversationList}
                        domPath={'/div#SideList.conversation-box/'}
                        updateHook={'onSelect'}
                    >
                        <div className={'header'} domPath={'/div#mainBox.chat-box/'} />
                        <DataHolder handler={ChatMessageList} domPath={'/div#mainBox.chat-box/'} />
                    </DataHolder>
                </DataHolder>
            </Page>
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
