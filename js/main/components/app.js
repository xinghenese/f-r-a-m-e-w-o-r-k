'use strict';

// dependencies
var _ = require('lodash');
var PhoneForm = require('./phoneform');
var CodeForm = require('./codeform');
var CountryForm = require('./countryform');
var Chat = require('./chat');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;

// private fields
var app = {
    _handleVerificationCodeSent: function () {
        router.transitionTo("code");
    },
    _handleCountryReadyToSelect: function () {
        router.transitionTo("country");
    },
    _handleCountryCodeSelected: function (countryInfo) {
        router.transitionTo("/", {}, {
            countryName: countryInfo.countryName,
            countryCode: countryInfo.countryCode
        });
    },
    _handleLoginSuccess: function () {
        router.transitionTo("chat");
    },
    _onProfileLoaded: function () {
        console.log("profile loaded, after login success!");
    }
};
var WrappedPhoneForm = _wrapComponent(PhoneForm, {
    onVerificationCodeSent: app._handleVerificationCodeSent,
    onCountryReadyToSelect: app._handleCountryReadyToSelect
});
var WrappedCountryForm = _wrapComponent(CountryForm, {
    onCountryCodeSelected: app._handleCountryCodeSelected
});
var WrappedCodeForm = _wrapComponent(CodeForm, {
    onLoginSuccess: app._handleLoginSuccess
});
var routes = (
    <Route name="app" path="/">
        <Route name="phone" handle={WrappedPhoneForm}/>
        <Route name="country" handler={WrappedCountryForm}/>
        <Route name="code" handler={WrappedCodeForm}/>
        <Route name="chat" handler={Chat}/>
        <DefaultRoute handler={WrappedPhoneForm}/>
    </Route>
);
var router = Router.create(routes);

// exports
module.exports = {
    start: function (element) {
        _startRouter(element);
        _initNotificationAgent();
    }
};

// private functions
function _initNotificationAgent() {
    var notificationAgent = require('./notificationagent');
    notificationAgent.init();
}

function _startRouter(element) {
    router.run(function(Handler, state) {
        React.render(<Handler params={state.routes.params}/>, element);
    });
}

function _wrapComponent(Component, props) {
    return React.createClass({
        displayName: "WrapComponent",
        render: function () {
            //pass the params, query and other props to the core component from
            //the outside wrapComponent
            return React.createElement(Component, _.assign(props, this.props));
        }
    });
}
