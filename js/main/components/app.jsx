/** @jsx React.DOM */

define(function(require, exports, module){

  'use strict';

  var Login = require('jsx!./login');
  var React = require('react');

  var App = React.createClass({
      _handleLoginSubmit: function(countryCode, phoneNumber) {
        console.log('submit');
          console.log(countryCode, '-', phoneNumber);
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