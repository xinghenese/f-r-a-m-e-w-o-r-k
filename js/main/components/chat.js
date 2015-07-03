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
    componentWillMount: function() {
        ChatActions.getChatList(1);
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
