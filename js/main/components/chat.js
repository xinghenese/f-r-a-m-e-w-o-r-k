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
        console.log("chat mounted");
        console.log(this.props);
    },
    render: function() {
        return (
            <div>
                <p>{this.props.id}</p>
                <p>{this.props.showAge}</p>
            </div>
        );
    }
});

module.exports = Chat;
