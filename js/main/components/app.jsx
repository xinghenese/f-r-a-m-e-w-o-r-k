/** @jsx React.DOM */

define(function(require, exports, module){

  'use strict';

    var Login = require('jsx!./login');
    var React = require('react');
    var httpconnection = require('../net/connection/httpconnection');
    var protocolpacket = require('../net/protocolpacket/protocolpacket');

    var App = React.createClass({
        _handleLoginSubmit: function(countryCode, phoneNumber) {
            console.log("submit");
            console.log(countryCode, "-", phoneNumber);
            httpconnection
                .request(protocolpacket.create({
                    url: "usr/lg",
                    data: {
                        mid: phoneNumber,
                        c: "1122",
                        pf: "1",
                        os: "PC",
                        dv: "1",
                        di: "1122334455",
                        uuid: "7e9d-501c-dbd816078039"
                    }
                }))
                .catch(function(reason){
                    console.log("login error: ", reason);
                })
                .then(function(value){
                    console.log("login sucess: ", value);
                })

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
                    onSubmit={this._handleLoginSubmit}
                />
            );
        }
    });

    module.exports = App;

});