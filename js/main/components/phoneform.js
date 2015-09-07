/**
 * Created by kevin on 6/26/15.
 */
'use strict';

//dependencies
require('../style/sign-in.css');

var _ = require('lodash');
var React = require('react');
var Lang = require('../locales/zh-cn');
var Styles = require('../constants/styles');
var KeyCodes = require('../constants/keycodes');
var AccountActions = require('../actions/accountactions');
var AccountStore = require('../stores/accountstore');
var stores = require('../utils/stores');
var promise = require('../utils/promise');

var Wrapper = require('./form/control/Wrapper');
var InputBox = require('./form/control/InputBox');
var Submit = require('./form/control/Submit');
var Form = require('./form/Form');
var CustomValidator = require('./form/validator/CustomValidator');
var RequiredValidator = require('./form/validator/RequiredFieldValidator');

var Countries = require('../constants/countries');

//private fields
var codeRegex = /\+86/;
var cnPhoneRegex = /^1[0-9]{10}$/;
var otherPhoneRegex = /^[0-9]{6,}/;
var requested = false;

//export
var PhoneForm = React.createClass({
    getInitialState: function() {
        return {
            countryName: "中国",
            countryCode: "+86",
            phoneNumber: AccountStore.getPhone() || '',
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
            this.refs.form.submit(event);
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
        }
        requested = true;

        this.props.onVerificationCodeSent();
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
    _awaitPhoneNumberCheckResult: function(code, phone, resolve, reject) {
        // observe AccountStore
        stores.observe(AccountStore, function() {
            return AccountStore.getVerificationCodeState() === AccountStore.VerificationCodeState.SENT;
        }).then(function() {
            if (AccountStore.hasRegistered()) {
                resolve();
            } else {
                reject("notRegisteredPhone");
            }
        });
        AccountActions.requestVerificationCode(code, phone);
    },
    componentWillMount: function() {
        requested = false;
    },
    componentDidMount: function() {
        this._focusPhoneInput();

        // update state if necessary
        var query = this.props.query;
        if (query && !_.isEmpty(query)) {
            this.setState({
                countryName: this._getCountryName(query.countryCode),
                countryCode: query.countryCode
            });
        }
    },
    render: function() {
        if (this.state.verificationState === AccountStore.VerificationCodeState.SENT) {
            this.props.onVerificationCodeSent();
        }

        return (
            <div className="sign-in">
                <Form className="main step1" ref="form" onSubmit={this._handleSubmit}>
                    <h1 className="title">{Lang.loginTitle}</h1>
                    <h2 className="subtitle">{Lang.loginSubTitle}</h2>
                    <div className="form-group country-selector">
                        <RequiredValidator
                            defaultMessage={Lang.country}
                            errorMessage={Lang.country}
                            successMessage={Lang.country}
                            controlsToValidate="country-input"
                            />
                        <input
                            id="country-input"
                            type="button"
                            onChange={this._handleCountryNameChange}
                            onClick={this._handleCountryReadyToSelect}
                            placeholder={this.state.countryName}
                            value={this.state.countryName}
                            />
                    </div>
                    <div className="form-group country-code">
                        <RequiredValidator
                            defaultMessage={Lang.code}
                            errorMessage={Lang.code}
                            successMessage={Lang.code}
                            controlsToValidate="code-input"
                            />
                        <input
                            id="code-input"
                            onChange={this._handleCountryCodeChange}
                            placeholder={this.state.countryCode}
                            value={this.state.countryCode}
                            />
                    </div>
                    <div className="form-group mobile-number">
                        <CustomValidator
                            defaultMessage={Lang.phone}
                            errorMessage={{
                                invalidPhone: Lang.invalidPhone,
                                notRegisteredPhone: Lang.notRegisteredPhone
                            }}
                            successMessage={Lang.phone}
                            controlsToValidate={["code-input", "phone-input"]}
                            controlToFocus="phone-input"
                            validationAtClient={function(code, phone) {
                                if (code == "+86" && cnPhoneRegex.test(phone)) {
                                    return true;
                                }
                                if (code != "+86" && otherPhoneRegex.test(phone)) {
                                    return true;
                                }
                                throw new Error("invalidPhone");
                            }}
                            validationAtServer={_.bind(function(code, phone) {
                                return promise.create(_.bind(this._awaitPhoneNumberCheckResult, this, code, phone));
                            }, this)}
                            />
                        <input
                            id="phone-input"
                            value={this.state.phoneNumber}
                            onKeyDown={this._handleKeyDown}
                            onChange={this._handlePhoneNumberChange}
                            />
                    </div>
                    <div className="form-group next">
                        <button type="submit" className="btn primary">{Lang.next}</button>
                    </div>
                </Form>
            </div>
        );
    }
});

module.exports = PhoneForm;
