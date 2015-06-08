/** @jsx React.DOM */

define(function(require, exports, module) {

    'use strict';

    var Login = require('jsx!./login');
    var React = require('react');
    var AccountActions = require('../actions/accountactions');
    var AccountStore = require('./stores/accountstore');
    //var httpconnection = require('../net/connection/httpconnection');

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
            //httpconnection.request({
            //    url: "usr/lg",
            //    data: {
            //        mid: phoneNumber,
            //        c: "1122",
            //        pf: "1",
            //        os: "PC",
            //        dv: "1",
            //        di: "1122334455",
            //        uuid: "7e9d-501c-dbd816078039"
            //    }
            //}).catch(function(reason) {
            //    console.log("login error: ", reason);
            //}).then(function(value) {
            //    console.log("login sucess: ", value);
            //    socketconnection.request()
            //});
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

});