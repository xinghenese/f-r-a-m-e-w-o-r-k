/** @jsx React.DOM */

'use strict';

var _ = require('lodash');
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
        console.log("checkPhoneStatus: ", status);
        this.transitionTo("chat", {t: "boy"}, {age: 8});
    },
    _handleCheckPhoneStatusError: function(error) {
        console.log("checkPhoneStatus: " + error);
    },
    _handleCheckVerificationCodeSuccess: function(status) {
        console.log("checkPhoneStatus: ", status);
        this.transitionTo("chat", {t: "boy"}, {age: 8});
    },
    _handleCheckVerificationCodeError: function(error) {
        console.log("checkPhoneStatus: " + error);
    },
    _handlePhoneSubmit: function(countryCode, phoneNumber) {
        console.log("submit");
        console.log(countryCode, "-", phoneNumber);
//        AccountActions.checkPhoneStatus(countryCode, phoneNumber);
        AccountActions.checkVerificationCode(countryCode, phoneNumber, 1, 1);
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
        var self = this;
//        AccountStore.addListener(AccountStore.Events.CHECK_PHONE_STATUS_SUCCESS, _.bind(self._handleCheckPhoneStatusSuccess, self));
//        AccountStore.addListener(AccountStore.Events.CHECK_PHONE_STATUS_ERROR,  _.bind(self._handleCheckPhoneStatusError, self));
        AccountStore.addListener(AccountStore.Events.CHECK_VERIFICATION_CODE_SUCCESS, _.bind(self._handleCheckVerificationCodeSuccess, self));
        AccountStore.addListener(AccountStore.Events.CHECK_VERIFICATION_CODE_FAILED, _.bind(self._handleCheckVerificationCodeError, self));
    },
    componentWillUnmount: function() {
        var self = this;
//        AccountStore.removeListener(AccountStore.Events.CHECK_PHONE_STATUS_SUCCESS, _.bind(self._handleCheckPhoneStatusSuccess, self));
//        AccountStore.removeListener(AccountStore.Events.CHECK_PHONE_STATUS_ERROR, _.bind(self._handleCheckPhoneStatusError, self));
        AccountStore.removeListener(AccountStore.Events.CHECK_VERIFICATION_CODE_SUCCESS, _.bind(self._handleCheckVerificationCodeSuccess, self));
        AccountStore.removeListener(AccountStore.Events.CHECK_VERIFICATION_CODE_FAILED, _.bind(self._handleCheckVerificationCodeError, self));
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