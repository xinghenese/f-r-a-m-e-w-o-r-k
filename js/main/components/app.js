/** @jsx React.DOM */

'use strict';

var _ = require('lodash');
var PhoneForm = require('./phoneform');
var CodeForm = require('./codeform');
var Chat = require('./chat');
var SmartSlot = require('./mixins/smartslot');
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
    _handleCheckVerificationCodeSuccess: function() {
        console.log("this");
        console.log(this);
        this.transitionTo("chat", {t: "boy"}, {age: 8});
    },
    _handleVerificationCodeSent: function() {
        console.log("to code");
        console.log(this);
        this.transitionTo("code");
        console.log('done');
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
var WrappedPhoneForm = wrapComponent(PhoneForm, {
    onVerificationCodeSent: app._handleVerificationCodeSent
});
var WrappedCodeForm = wrapComponent(CodeForm, {
    onCheckVerificationCodeSuccess: app._handleCheckVerificationCodeSuccess
});
var routes = (
    <Route name="app" path="/" handler={App}>
        <Route name="phone" handle={WrappedPhoneForm} />
        <Route name="code" handler={WrappedCodeForm} />
        <Route name="chat" path="/chat/:t" handler={Chat} />
        <DefaultRoute handler={WrappedPhoneForm} />
    </Route>
);

module.exports = {
    start: function(element) {
        Router.run(routes, function(Handler, state) {
            React.render(<Handler params={state.routes.params}/>, element);
        });
    }
};
