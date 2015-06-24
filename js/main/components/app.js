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
    _handleCheckPhoneStatusSuccess: function(status) {
        console.log(status);
        this.transitionTo("chat", {t: "boy"}, {age: 8});
        if (status.hr == 0) {
            this.transitionTo("code");
        }
    },
    _handleCheckPhoneStatusError: function(error) {
        console.log("checkPhoneStatus: " + error);
    },
    _handlePhoneSubmit: function(countryCode, phoneNumber) {
        console.log("submit");
        console.log(countryCode, "-", phoneNumber);
        AccountActions.requestVerificationCode(
            countryCode,
            phoneNumber,
            1, // register/login
            1  // text code
        );
    },
    _handleVerificationCodeSent: function(data) {
        console.log(data);
    },
    _handleVerificationCodeNotSent: function(error) {
        console.log(error);
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
        AccountStore.on(AccountStore.Events.VERIFICATION_CODE_SENT, this._handleVerificationCodeSent);
        AccountStore.on(AccountStore.Events.VERIFICATION_CODE_NOT_SENT, this._handleVerificationCodeNotSent);
    },
    componentWillUnmount: function() {
        AccountStore.removeListener(AccountStore.Events.VERIFICATION_CODE_SENT, this._handleVerificationCodeSent);
        AccountStore.removeListener(AccountStore.Events.VERIFICATION_CODE_NOT_SENT, this._handleVerficationCodeNotSent);
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
        <Route name="chat" path="/chat/:t" handler={Chat} />
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