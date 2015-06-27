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
        Navigation,
        SmartSlot
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
    _handleCheckVerificationCodeSuccess: function(status) {
        this.transitionTo("chat", {t: "boy"}, {age: 8});
    },
    _handleCheckVerificationCodeError: function(error) {
        console.log("checkCode: " + error);
    },
    _handleCodeSubmit: function(verificationCode) {
        console.log("code submit");
        AccountActions.checkVerificationCode(
            AccountStore.getCode(),
            AccountStore.getPhone(),
            AccountStore.getRequestType(),
            verificationCode
        );
    },
    _handlePhoneSubmit: function(countryCode, phoneNumber) {
        console.log(countryCode, "-", phoneNumber);
        AccountActions.requestVerificationCode(
            countryCode,
            phoneNumber,
            1, // register/login
            1  // text code
        );
    },
    _handleVerificationCodeSent: function() {
        this.transitionTo("code");
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
        AccountStore.on(AccountStore.Events.CHECK_VERIFICATION_CODE_SUCCESS, this._handleCheckVerificationCodeSuccess);
        AccountStore.on(AccountStore.Events.CHECK_VERIFICATION_CODE_FAILED, this._handleCheckVerificationCodeError);
    },
    componentWillUnmount: function() {
        AccountStore.removeListener(AccountStore.Events.VERIFICATION_CODE_SENT, this._handleVerificationCodeSent);
        AccountStore.removeListener(AccountStore.Events.VERIFICATION_CODE_NOT_SENT, this._handleVerificationCodeNotSent);
        AccountStore.removeListener(AccountStore.Events.CHECK_VERIFICATION_CODE_SUCCESS, this._handleCheckVerificationCodeSuccess);
        AccountStore.removeListener(AccountStore.Events.CHECK_VERIFICATION_CODE_FAILED, this._handleCheckVerificationCodeError);
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
    onSubmit: app._handlePhoneSubmit
});
var WrappedCodeForm = wrapComponent(CodeForm, {
    onSubmit: app._handleCodeSubmit
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
