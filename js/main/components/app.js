/** @jsx React.DOM */

'use strict';

var Login = require('./login');
var Chat = require('./chat');
var React = require('react');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var AccountActions = require('../actions/accountactions');
var AccountStore = require('../stores/accountstore');

var App = React.createClass({
    mixins: [
        Navigation
    ],
    _handleDidReceivePhoneStatus: function(status) {
        console.log("checkPhoneStatus: " + status);
        this.transitionTo("chat", {id: 10, showAge: true});
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
            <RouteHandler />
        );
    }
});

function wrapComponent(Component, props) {
    return React.createClass({
        render: function() {
            return React.createElement(Component, props);
        }
    });
}

var app = new App();
var WrappedLogin = wrapComponent(Login, {
    onSubmit: app._handlePhoneSubmit
});
var routes = (
    <Route name="app" path="/" handler={App}>
        <Route name="login" handler={WrappedLogin} />
        <Route name="chat" handler={Chat} />
        <DefaultRoute handler={WrappedLogin} />
    </Route>
);

module.exports = {
    start: function(element) {
        Router.run(routes, function(Handler, state) {
            React.render(<Handler params={state.routes.params}/>, element);
        });
    }
};