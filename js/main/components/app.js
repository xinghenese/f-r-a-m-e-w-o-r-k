/** @jsx React.DOM */

'use strict';

// dependencies
var PhoneForm = require('./phoneform');
var CodeForm = require('./codeform');
var Chat = require('./chat');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;

// private fields
var app = {
    _handleVerificationCodeSent: function() {
        router.transitionTo("code");
    },
    _handleLoginSuccess: function() {
        router.transitionTo("chat", {t: "boy"}, {age: 8});
    },
    _onProfileLoaded: function() {
        console.log("profile loaded, after login success!");
    }
};
var WrappedPhoneForm = _wrapComponent(PhoneForm, {
    onVerificationCodeSent: app._handleVerificationCodeSent
});
var WrappedCodeForm = _wrapComponent(CodeForm, {
    onLoginSuccess: app._handleLoginSuccess
});
var routes = (
    <Route name="app" path="/">
        <Route name="phone" handle={WrappedPhoneForm} />
        <Route name="code" handler={WrappedCodeForm} />
        <Route name="chat" path="/chat/:t" handler={Chat} />
        <DefaultRoute handler={WrappedPhoneForm} />
    </Route>
);
var router = Router.create(routes);

// export
module.exports = {
    start: function(element) {
        router.run(function(Handler, state) {
            React.render(<Handler params={state.routes.params}/>, element);
        });
    }
};

// private functions
function _wrapComponent(Component, props) {
    return React.createClass({
        render: function() {
            return React.createElement(Component, props);
        }
    });
}
