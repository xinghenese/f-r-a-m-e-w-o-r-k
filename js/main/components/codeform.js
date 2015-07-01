'use strict';

var _ = require('lodash');
var React = require('react');
var Lang = require('../locales/zh-cn');
var KeyCodes = require('../constants/keycodes');
var AccountActions = require('../actions/accountactions');
var AccountStore = require('../stores/accountstore');
var style = require('../style/login');
var makeStyle = require('../style/styles').makeStyle;

var CodeForm = React.createClass({
    getInitialState: function() {
        return {
            smsCode: "",
            promptInvalidSMSCode: false
        };
    },
    _focusInput: function() {
        React.findDOMNode(this.refs.smscode).focus();
    },
    _handleCheckVerificationCodeSuccess: function() {
        this.props.onCheckVerificationCodeSuccess();
    },
    _handleCheckVerificationCodeError: function(error) {
        console.log("checkCode: " + error);
    },
    _handleCodeChange: function(event) {
        this.setState({smsCode: event.target.value});
    },
    _handleKeyDown: function(event) {
        if (event.keyCode == KeyCodes.ENTER) {
            this._handleSubmit();
        }
    },
    _handleSubmit: function() {
        if (!this._validateSMSCode()) {
            this.setState({promptInvalidSMSCode: true});
            this._focusInput();
        } else {
            AccountActions.login(
                AccountStore.getCode(),
                AccountStore.getPhone(),
                AccountStore.getRequestType(),
                this.state.smsCode
            );
        }
    },
    _validateSMSCode: function() {
        return (/(\d){5,}/).test(this.state.smsCode);
    },
    componentDidMount: function() {
        this._focusInput();
    },
    componentWillMount: function() {
        AccountStore.on(AccountStore.Events.CHECK_VERIFICATION_CODE_SUCCESS, this._handleCheckVerificationCodeSuccess);
        AccountStore.on(AccountStore.Events.CHECK_VERIFICATION_CODE_FAILED, this._handleCheckVerificationCodeError);
    },
    componentWillUnmount: function() {
        AccountStore.removeListener(AccountStore.Events.CHECK_VERIFICATION_CODE_SUCCESS, this._handleCheckVerificationCodeSuccess);
        AccountStore.removeListener(AccountStore.Events.CHECK_VERIFICATION_CODE_FAILED, this._handleCheckVerificationCodeError);
    },
    render: function() {
        var login = style.login;
        var loginForm = login.form;
        var codeForm = login.codeForm;
        return (
            <div style={makeStyle(login)}>
                <div className="login-code-form" style={codeForm}>
                    <p className="login-current-phone" style={loginForm.title}>
                        {AccountStore.getCode() + " - " + AccountStore.getPhone()}
                    </p>

                    <p
                        className="login-send-code-notice"
                        style={makeStyle(codeForm.commonText, codeForm.notice)}
                        dangerouslySetInnerHTML={{__html: Lang.sendCodeNotice}}
                        >
                    </p>

                    <div className="login-enter-code">
                        <label style={makeStyle(loginForm.label)}>{Lang.enterCode}</label>
                        <input type="text"
                               style={makeStyle(loginForm.input, codeForm.commonText)}
                               autoComplete="off"
                               type="tel"
                               ref="smscode"
                               onKeyDown={this._handleKeyDown}
                               onChange={this._handleCodeChange}
                               onBlur={onInputBlur}
                               onFocus={onInputFocus}
                            />
                    </div>
                    <div>
                        <input
                            type="submit"
                            value={Lang.next}
                            style={makeStyle(loginForm.button, codeForm.submit)}
                            onClick={this._handleSubmit}
                            />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = CodeForm;

//private functions
function onInputBlur(event) {
    event.target.style.borderBottom = style.login.form.input.borderBottom;
}

function onInputFocus(event) {
    event.target.style.borderBottom = style.login.form.inputFocus.borderBottom;
}