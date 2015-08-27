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
var promise = require('../utils/promise');

var Wrapper = require('./form/control/Wrapper');
var InputBox = require('./form/control/InputBox');
var Submit = require('./form/control/Submit');
var Form = require('./form/Form');
var CustomValidator = require('./form/validator/CustomValidator');

var CodeForm = React.createClass({
    _focusInput: function() {
        React.findDOMNode(this.refs.smscode || this.refs.form.refs.smscode).focus();
    },
    _handleKeyDown: function(event) {
        if (event.keyCode == KeyCodes.ENTER) {
            this.refs.form.submit(event);
        }
    },
    _handleSubmit: function() {
        console.info('_handleSubmit');
        this.props.onLoginSuccess();
    },
    _requestSMSCodeValidation: function(code) {
        console.info('_requestSMSCodeValidation');
        AccountActions.login(
            AccountStore.getCode(),
            AccountStore.getPhone(),
            code
        );
    },
    _awaitSMSCodeValidationResult: function(resolve, reject) {
        stores.observe(AccountStore, function() {
            return AccountStore.getLoginState() === AccountStore.LoginState.SUCCESS;
        }).then(function() {
            resolve(AccountStore.LoginState.SUCCESS);
        });
        stores.observe(AccountStore, function() {
            return AccountStore.getLoginState() === AccountStore.LoginState.FAILED;
        }).then(function() {
            reject(AccountStore.getLoginErrorCode());
        });
    },
    componentDidMount: function() {
        this._focusInput();
    },
    render: function() {
        return (
            <div className="sign-in">
                <Form className="main confirm" onSubmit={this._handleSubmit} ref="form">
                    <div className="form-group caption">
                        <p className="mobile-number">{AccountStore.getCode() + " - " + AccountStore.getPhone()}</p>
                        <p className="help-text" dangerouslySetInnerHTML={{__html: Lang.sendCodeNotice}} />
                    </div>

                    <div className="form-group code">
                        <CustomValidator
                            defaultMessage={Lang.enterCode}
                            errorMessage={Lang.codeError}
                            successMessage={Lang.codeSuccess}
                            controlsToValidate={["sms-code-input"]}
                            validationAtClient={function(code) {
                                return (/(\d){5,}/).test(code);
                            }}
                            validationAtServer={_.bind(function(code) {
                                console.info('validationAtServer: ', code);
                                var result = promise.create(this._awaitSMSCodeValidationResult);
                                this._requestSMSCodeValidation(code);
                                return result;
                            }, this)}
                            />
                        <input
                            id="sms-code-input"
                            ref="smscode"
                            onKeyDown={this._handleKeyDown}
                            />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn primary">{Lang.next}</button>
                    </div>
                </Form>
            </div>
        );
    }
});

module.exports = CodeForm;

//private functions
