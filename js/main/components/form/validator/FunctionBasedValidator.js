/**
 * Created by kevin on 7/2/15.
 */
'use strict';

// dependencies
var React = require('react');
var Validator = require('./Validator');
var referable = require('../../mixins/referable');
var validatable = require('../../mixins/validatable');

// private fields

// exports
var FunctionBasedValidator = React.createClass({
    mixins: [referable, validatable],
    render: function () {
        return (
            <Validator
                className={this.props.className}
                defaultMessage={this.props.defaultMessage}
                errorMessage={this.props.errorMessage}
                successMessage={this.props.successMessage}
                controlsToValidate={this.props.controlsToValidate}
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
    return function () {
        return validator.props.validateFunc();
    };
}
