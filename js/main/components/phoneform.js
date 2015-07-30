/**
 * Created by kevin on 6/26/15.
 */
'use strict';

//dependencies
var _ = require('lodash');
var React = require('react');
var Lang = require('../locales/zh-cn');
var Styles = require('../constants/styles');
var KeyCodes = require('../constants/keycodes');
var AccountActions = require('../actions/accountactions');
var AccountStore = require('../stores/accountstore');
var style = require('../style/login');
var makeStyle = require('../style/styles').makeStyle;
var stores = require('../utils/stores');

var Wrapper = require('./form/control/Wrapper');
var InputBox = require('./form/control/InputBox');
var Submit = require('./form/control/Submit');
var Form = require('./form/Form');
var CustomValidator = require('./form/validator/CustomValidator');
var RequiredValidator = require('./form/validator/RequiredFieldValidator');

var Countries = require('../constants/countries');

//private fields
var codeRegex = /\+86/;
var phoneRegex = /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/;
var requested = false;

//export
var PhoneForm = React.createClass({
    getInitialState: function() {
        return {
            countryName: "中国",
            countryCode: "+86",
            phoneNumber: "",
            promptInvalidPhone: false,
            verificationState: null
        };
    },
    _focusPhoneInput: function() {
        document.getElementById("phone-input").focus();
    },
    _handleCountryNameChange: function(event) {
        var name = event.target.value;
        var code = this._getCountryCode(name);
        this.setState({countryName: name, countryCode: code});
    },
    _handleCountryCodeChange: function(event) {
        var code = event.target.value;
        var name = this._getCountryName(code);
        this.setState({countryName: name, countryCode: code});
    },
    _handleKeyDown: function(event) {
        if (event.keyCode == KeyCodes.ENTER) {
            this._handleSubmit();
        }
    },
    _handleCountryReadyToSelect: function() {
        this.props.onCountryReadyToSelect();
    },
    _handlePhoneNumberChange: function(event) {
        this.setState({
            phoneNumber: event.target.value,
            promptInvalidPhone: false
        });
    },
    _handleSubmit: function() {
        if (requested) {
            return;
        } else {
            requested = true;
        }

        AccountActions.requestVerificationCode(
            this.state.countryCode,
            this.state.phoneNumber
        );
    },
    _handleVerificationCodeSent: function() {
        this.props.onVerificationCodeSent();
    },
    _handleVerificationCodeNotSent: function(error) {
        console.log(error);
    },
    _getCountryName: function(code) {
        for (var i = 0; i < Countries.length; i++) {
            var country = Countries[i];
            if (country.code == code) {
                return country.name;
            }
        }
        return Lang.unknown;
    },
    _getCountryCode: function() {
        for (var i = 0; i < Countries.length; i++) {
            var country = Countries[i];
            if (this.state.countryName == country.name) {
                return country.code;
            }
        }
        return "";
    },
    componentDidMount: function() {
        this._focusPhoneInput();
    },
    componentWillMount: function() {
        //observe AccountStore
        var self = this;
        stores.observe(AccountStore, function() {
            return AccountStore.getVerificationCodeState() === AccountStore.VerificationCodeState.SENT;
        }).then(function() {
            self._handleVerificationCodeSent();
        });
        stores.observe(AccountStore, function() {
            return AccountStore.getVerificationCodeState() === AccountStore.VerificationCodeState.FAILED;
        }).then(function() {
            self._handleVerificationCodeNotSent();
        });

        //update state if necessary
        var query = this.props.query;
        if (query && !_.isEmpty(query)) {
            this.setState({
                countryName: query.countryName,
                countryCode: query.countryCode
            });
        }
    },
    render: function() {
        if (this.state.verificationState === AccountStore.VerificationCodeState.SENT) {
            this._handleVerificationCodeSent();
        }

        var login = style.login;
        var loginForm = login.form;

        return (
            <div style={makeStyle(login)}>
                <Form className="login-form" style={makeStyle(loginForm)} onSubmit={this._handleSubmit}>
                    <p style={makeStyle(loginForm.title)}>{Lang.loginTitle}</p>
                    <p style={makeStyle(loginForm.p)}>{Lang.loginSubTitle}</p>
                    <Wrapper className="login-form-country-name" style={makeStyle(loginForm.countryName)}>
                        <RequiredValidator
                            style={loginForm.label}
                            defaultMessage={Lang.country}
                            errorMessage={Lang.country}
                            successMessage={Lang.country}
                            controlsToValidate="country-input"
                        />
                        <InputBox
                            id="country-input"
                            style={makeStyle(loginForm.input, loginForm.input.country)}
                            onChange={this._handleCountryNameChange}
                            onClick={this._handleCountryReadyToSelect}
                            defaultValue={this.state.countryName}
                            initialValue={this.state.countryName}
                        />
                    </Wrapper>
                    <Wrapper>
                        <Wrapper className="login-form-country-code" style={makeStyle(loginForm.countryCode)}>
                            <RequiredValidator
                                style={loginForm.label}
                                defaultMessage={Lang.code}
                                errorMessage={Lang.code}
                                successMessage={Lang.code}
                                controlsToValidate="code-input"
                            />
                            <InputBox
                                id="code-input"
                                style={makeStyle(loginForm.input)}
                                onChange={this._handleCountryCodeChange}
                                defaultValue={this.state.countryCode}
                                initialValue={this.state.countryCode}
                            />
                        </Wrapper>
                        <Wrapper className="login-form-phone-number" style={makeStyle(loginForm.phoneNumber)}>
                            <CustomValidator
                                style={loginForm.label}
                                defaultMessage={Lang.phone}
                                errorMessage={Lang.invalidPhone}
                                successMessage={Lang.phone}
                                controlsToValidate={["code-input", "phone-input"]}
                                controlToFocus="phone-input"
                                validationAtClient={function(code, phone) {
                                    return code != "+86" || phoneRegex.test(phone);
                                }}
                            />
                            <InputBox
                                id="phone-input"
                                style={loginForm.input}
                                value={this.state.phoneNumber}
                                onKeyDown={this._handleKeyDown}
                                onChange={this._handlePhoneNumberChange}
                                />
                        </Wrapper>
                    </Wrapper>
                    <Wrapper>
                        <Submit
                            value={Lang.next}
                            style={loginForm.button}
                        />
                    </Wrapper>
                </Form>
            </div>
        );
    }
});

module.exports = PhoneForm;
