/**
 * Created by kevin on 6/15/15.
 */
'use strict';

var React = require('react');
var Router = require('react-router');
var State = Router.State;

var Chat = React.createClass({
    render: function() {
        return (
            <div>
                <p>{this.props.params.t}</p>
            </div>
        );
    }
});

module.exports = Chat;
