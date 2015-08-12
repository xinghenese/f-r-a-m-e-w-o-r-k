'use strict';

var _ = require('lodash');
var React = require('react');
var Lang = require('../locales/zh-cn');
var KeyCodes = require('../constants/keycodes');
var AccountActions = require('../actions/accountactions');
var AccountStore = require('../stores/accountstore');
var errors = require('../constants/errors');
var style = require('../style/login');
var makeStyle = require('../style/styles').makeStyle;
var stores = require('../utils/stores');

var Wrapper = require('./form/control/Wrapper');
var InputBox = require('./form/control/InputBox');
var Submit = require('./form/control/Submit');
var Form = require('./form/Form');
var CustomValidator = require('./form/validator/CustomValidator');

var CodeForm = React.createClass({
    getInitialState: function() {
        return {
            smsCode: "",
            promptInvalidSMSCode: false
        };
    },
    _focusInput: function() {
        React.findDOMNode(this.refs.smscode || this.refs.form.refs.smscode).focus();
    },
    _handleCodeChange: function(event) {
        this.setState({smsCode: event.target.value});
    },
    _handleKeyDown: function(event) {
        if (event.keyCode == KeyCodes.ENTER) {
            this._handleSubmit();
        }
    },
    _handleLoginFailed: function() {
        this.setState({promptInvalidSMSCode: true});
    },
    _handleSubmit: function() {
        AccountActions.login(
            AccountStore.getCode(),
            AccountStore.getPhone(),
            this.state.smsCode
        );
    },
    componentDidMount: function() {
        this._focusInput();
    },
    componentWillMount: function() {
        var self = this;
        stores.observe(AccountStore, function() {
            return AccountStore.getLoginState() === AccountStore.LoginState.SUCCESS;
        }).then(function() {
            self.props.onLoginSuccess();
        });
        stores.observe(AccountStore, function() {
            return AccountStore.getLoginState() === AccountStore.LoginState.FAILED;
        }).then(function() {
            self._handleLoginFailed(AccountStore.getLoginErrorCode());
        });
    },
    render: function() {
        var login = style.login;
        var loginForm = login.form;
        var codeForm = login.codeForm;
        return (
            <div style={makeStyle(login)}>
                <Form className="login-code-form" style={codeForm} onSubmit={this._handleSubmit} ref="form">
                    <p className="login-current-phone" style={loginForm.title}>
                        {AccountStore.getCode() + " - " + AccountStore.getPhone()}
                    </p>

                    <p
                        className="login-send-code-notice"
                        style={makeStyle(codeForm.commonText, codeForm.notice)}
                        dangerouslySetInnerHTML={{__html: Lang.sendCodeNotice}}
                        >
                    </p>

                    <Wrapper className="login-enter-code">
                        <CustomValidator
                            style={makeStyle(loginForm.label)}
                            defaultMessage={Lang.enterCode}
                            errorMessage={Lang.codeError}
                            successMessage={Lang.codeSuccess}
                            controlsToValidate={["sms-code-input"]}
                            validationAtClient={function(code) {
                                return (/(\d){5,}/).test(code);
                            }}
                            />
                        <InputBox
                            id="sms-code-input"
                            ref="smscode"
                            style={makeStyle(loginForm.input, codeForm.commonText)}
                            onKeyDown={this._handleKeyDown}
                            onChange={this._handleCodeChange}
                            />
                    </Wrapper>
                    <Wrapper>
                        <Submit
                            value={Lang.next}
                            style={makeStyle(loginForm.button, codeForm.submit)}
                            />
                    </Wrapper>
                </Form>
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
