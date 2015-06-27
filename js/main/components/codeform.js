'use strict';

var _ = require('lodash');
var React = require('react');
var Lang = require('../locales/zh-cn');
var Styles = require('../constants/styles');
var KeyCodes = require('../constants/keycodes');
var AccountStore = require('../stores/accountstore');
var style = require('../style/login');
var makeStyle = require('../style/stylenormalizer');

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
            this.props.onSubmit(this.state.countryCode, this.state.phoneNumber);
        }
    },
    _validateSMSCode: function() {
        //should extend logic here by using promise
        return true;
    },
    componentDidMount: function() {
        this._focusInput();
    },
    render: function() {
        var login = style.login;
        var loginForm = login.form;
        var codeForm = login.codeForm;
        var phoneLableStyle = makeStyle(loginForm.label);
        if (this.state.promptInvalidPhone) {
            _.assign(phoneLableStyle, {
                color: Styles.ERROR_TEXT_COLOR
            });
        }
        return (
            <div style={makeStyle(login)}>
                <div className="login-code-form" style={codeForm}>
                    <p className="login-current-phone" style={loginForm.title}>
                        {AccountStore.getCode() + " " + AccountStore.getPhone()}
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
                               onChange={this._handleCountryCodeChange}
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