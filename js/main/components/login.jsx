/** @jsx React.DOM */
define(function(require, exports, module){

  'use strict';

  var React = require('react');

  var Login = React.createClass({
    getInitialState: function() {
      return {countrCode: "+86", phoneNumber: ""};
    },
    handleCountryCodeChange: function(event) {
      this.setState({countrCode: event.target.value});
    },
    handlePhoneNumberChange: function(event) {
      this.setState({phoneNumber: event.target.value});
    },
    handleSubmit: function(event) {
      this.props.onSubmit(this.state.countrCode, this.state.phoneNumber);
    },
    render: function() {
      var style = {
        "div": {
          "margin": "-131px auto 90px",
          "maxWidth": "404px"
        },
        "cursive": {
          "fontFamily": "cursive",
          "fontSize": "16px"
        },
        "_loginHead": {
          "height": "74px"
        },
        "a": {
          "float": "right",
          "cursor": "pointer",
          "color": "#ffffff",
          "textDecoration": "none",
          "padding": "27px 15px 28px",
          "lineHeight": "20px"
        },
        "_loginForm": {
          "background": "#fff",
          "padding": "40px",
          "height": "252px"
        },
        "p": {
          "color": "#999",
          "fontSize": "13px",
          "lineHeight": "1.6",
          "margin": "15px 0 30px"
        },
        "_loginInput": {
          "borderBottom": "1px solid #e6e6e6",
          "height": "50px",
          "margin": "0 0 22px"
        },
        "label": {
          "color": "#999",
          "cursor": "pointer",
          "display": "block",
          "fontSize": "13px",
          "fontWeight": "400"
        },
        "input": {
          "background": "none repeat scroll 0 0 #FFFFFF",
          "border": "0 none",
          "boxShadow": "none",
          "color": "#000",
          "display": "inline-block",
          "fontSize": "13px",
          "margin": "3px 0 0",
          "outline": "0 none",
          "padding": "3px 0",
          "resize": "none",
          "width": "100%",
        },
        "Code": {
          "float": "left",
          "marginRight": "25px",
          "width": "50px",
          "background": "none repeat scroll 0 0 #FFFFFF",
          "border": "0 none",
          "boxShadow": "none",
          "color": "#000",
          "display": "inline-block",
          "fontSize": "13px",
          "margin": "3px 0 0",
          "outline": "0 none",
          "padding": "3px 0",
          "resize": "none",
          "borderBottom": "1px solid #e6e6e6"
        },
        "Number": {
          "marginLeft": "70px",
          "background": "none repeat scroll 0 0 #FFFFFF",
          "border": "0 none",
          "boxShadow": "none",
          "color": "#000",
          "display": "inline-block",
          "fontSize": "13px",
          "margin": "3px 0 0",
          "outline": "0 none",
          "padding": "3px 0",
          "resize": "none",
          "borderBottom": "1px solid #e6e6e6",
          "float": "right",
          "width": "260px"
        }
      };
      return (
        <div style={style.div}>
          <div className="login-head" style={style._loginHead}>
            <a style={style.a} onClick={this.handleSubmit}>Next &gt;</a>
          </div>
          <div className="login-form" style={style._loginForm}>
            <h3>Sign in</h3>
            <p style={style.p}>
              Please choose your country and enter your full phone number.
            </p>
            <div className="login-country" style={style._loginInput}>
              <label style={style.label}>Country: </label>
                <input style={style.input} autoComplete="off" type="tel" onChange={this.handleCountryNameChange} value="China"/>
            </div>
            <div>
              <div style={style.Code}>
                <label style={style.label}>Code: </label>
                <input style={style.input} autoComplete="off" type="tel" onChange={this.handleCountryCodeChange} value="+86"/>
              </div>
              <div  style={style.Number}>
                <label style={style.label}>Phone Number: </label>
                <input style={style.input} required="" autoComplete="off" type="tel" onChange={this.handlePhoneNumberChange} />
              </div>
            </div>
          </div>
        </div>
        );
    }
  });

  module.exports = Login;

});

