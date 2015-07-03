/**
 * Created by kevin on 7/2/15.
 */
'use strict';

// dependencies
var React = require('react');
var Validator = require('./Validator');

// private fields
var _prefix = "function-based-validator-";
var _index = 0;

// exports
var FunctionBasedValidator = React.createClass({
    _seq: _prefix + (_index++),
    validate: function() {
        return this.refs[this._seq].validate();
    },
    render: function() {
        return (
            <Validator
                className={this.props.className}
                defaultMessage={this.props.defaultMessage}
                errorMessage={this.props.errorMessage}
                successMessage={this.props.successMessage}
                controlToValidate={this.props.controlToValidate}
                validationAtClient={_validation(this)}
                validationAtServer={this.props.validationAtServer}
                ref={this._seq}
                />
        );
    }
});

module.exports = FunctionBasedValidator;

// private functions
function _validation(validator) {
    return function() {
        return validator.props.validateFunc();
    };
}