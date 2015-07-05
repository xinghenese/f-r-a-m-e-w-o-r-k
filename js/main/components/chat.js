/**
 * Created by kevin on 6/15/15.
 */
'use strict';

var React = require('react');
var Router = require('react-router');
var State = Router.State;
var ChatActions = require('../actions/chatactions');
var ChatStore = require('../stores/chatstore');

var Chat = React.createClass({
    _handleGroupsLoaded: function() {
        // todo
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
    },
    componentWillUnmount: function() {
        ChatStore.removeListener(ChatStore.Events.GROUPS_LOAD_SUCCESS, this._handleGroupsLoaded);
        ChatStore.removeListener(ChatStore.Events.USERS_LOAD_SUCCESS, this._handleUsersLoaded);
    },
    render: function() {
        return (
            <div>
                <p>{this.props.params.t}</p>
            </div>
        );
    }
});

module.exports = Chat;
