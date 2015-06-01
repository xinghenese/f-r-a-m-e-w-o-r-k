'use strict';

var Login = require('./login');
var React = require('react');
var LoginActions = require('../actions/loginactions');
var AccountStore = require('../stores/accountstore');
var ProfileStore = require('../stores/profilestore');

var App = React.createClass({
    _handleLoginSubmit: function(countryCode, phoneNumber) {
        LoginActions.login(countryCode, '-', phoneNumber);
    },
    _onLoginSuccess: function() {
        console.log('login success');
    },
    _onLoginFailed: function() {
        console.log('login failed');
    },
    _onProfileLoaded: function() {
        console.log('profile loaded, after login success!');
    },
    componentDidMount: function() {
        AccountStore.addLoginSuccessListener(this._onLoginSuccess);
        AccountStore.addLoginFailedListener(this._onLoginFailed);
        ProfileStore.addProfileLoadedListener(this._onProfileLoaded);
    },
    componentWillUnmount: function() {
        AccountStore.removeLoginSuccessListener(this._onLoginSuccess);
        AccountStore.removeLoginFailedListener(this._onLoginFailed);
        ProfileStore.removeProfileLoadedListener(this._onProfileLoaded);
    },
    render: function() {
        return (
            <Login
                onSubmit={this._handleLoginSubmit}
            />
        );
    }
});

module.exports = App;
