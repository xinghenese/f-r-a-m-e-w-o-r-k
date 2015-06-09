/** @jsx React.DOM */

'use strict';

var Login = require('./login');
var React = require('react');
var AccountActions = require('../actions/accountactions');
var AccountStore = require('../stores/accountstore');

var App = React.createClass({
    _handleDidReceivePhoneStatus: function(status) {
        console.log("checkPhoneStatus: " + status);
    },
    _handleCheckPhoneStatusError: function(error) {
        console.log("checkPhoneStatus: " + error);
    },
    componentWillMount: function() {
        AccountStore.addDidReceivePhoneStatusListener(this._handleDidReceivePhoneStatus);
        AccountStore.addCheckPhoneStatusErrorListener(this._handleCheckPhoneStatusError);
    },
    componentWillUnmount: function() {
        AccountStore.removeDidReceivePhoneStatusListener(this._handleDidReceivePhoneStatus);
        AccountStore.removeCheckPhoneStatusErrorListener(this._handleCheckPhoneStatusError);
    },
    _handlePhoneSubmit: function(countryCode, phoneNumber) {
        console.log("submit");
        console.log(countryCode, "-", phoneNumber);
        AccountActions.checkPhoneStatus(countryCode, phoneNumber);
    },
    _onLoginSuccess: function() {
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
            <Login
                onSubmit={this._handlePhoneSubmit}
                />
        );
    }
});

module.exports = App;