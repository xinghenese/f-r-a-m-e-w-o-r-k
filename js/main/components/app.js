/** @jsx React.DOM */

'use strict';

var Login = require('./login');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var AccountActions = require('../actions/accountactions');
var AccountStore = require('../stores/accountstore');

var App = React.createClass({
    _handleDidReceivePhoneStatus: function(status) {
        console.log("checkPhoneStatus: " + status);
    },
    _handleCheckPhoneStatusError: function(error) {
        console.log("checkPhoneStatus: " + error);
    },
    _handlePhoneSubmit: function(countryCode, phoneNumber) {
        console.log("submit");
        console.log(countryCode, "-", phoneNumber);
        AccountActions.checkPhoneStatus(countryCode, phoneNumber);
    },
    _onLoginSuccess: function() {
        console.log(this);
        console.log("login success");
    },
    _onLoginFailed: function() {
        console.log("login failed");
    },
    _onProfileLoaded: function() {
        console.log("profile loaded, after login success!");
    },
    componentWillMount: function() {
        AccountStore.addDidReceivePhoneStatusListener(this._handleDidReceivePhoneStatus);
        AccountStore.addCheckPhoneStatusErrorListener(this._handleCheckPhoneStatusError);
    },
    componentWillUnmount: function() {
        AccountStore.removeDidReceivePhoneStatusListener(this._handleDidReceivePhoneStatus);
        AccountStore.removeCheckPhoneStatusErrorListener(this._handleCheckPhoneStatusError);
    },
    render: function() {
        return (
            <RouteHandler
                onSubmit={this._handlePhoneSubmit}
                />
        );
    }
});

var routes = (
    <Route name="app" path="/" handler={App}>
        <Route name="login" handler={Login}/>
        <DefaultRoute handler={Login}/>
    </Route>
);

module.exports = {
    start: function(element) {
        Router.run(routes, function(Handler) {
            React.render(<Handler/>, element);
        });
    }
};