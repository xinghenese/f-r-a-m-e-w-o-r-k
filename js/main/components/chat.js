/**
 * Created by kevin on 6/15/15.
 */
'use strict';

var React = require('react');
var Router = require('react-router');
var State = Router.State;

var Chat = React.createClass({
    mixins: [
        State
    ],
    componentDidMount: function() {
        console.log(this.props.params);
    },
    render: function() {
        return (
            <div></div>
        );
    }
});

module.exports = Chat;
