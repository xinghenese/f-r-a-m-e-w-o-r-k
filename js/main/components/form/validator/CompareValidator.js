/**
 * Created by Administrator on 2015/6/26.
 */

//dependencies
var React = require('react');
var Validator = require('./Validator');

//private fields
var seq = 'compare-validator-';
var index = 0;

//core module to export
var CompareValidator = React.createClass({
    _seq: seq + (index++),
    validate: function() {
        return this.refs[this._seq].validate();
    },
    render: function() {
        if (!_.isUndefined(this.props.max) && !_.isUndefined(this.props.min)) {
            console.error('no max or min props found in CompareValidator');
            return null;
        }
        return (
            <Validator
                className={this.props.className}
                defaultMessage={this.props.defaultMessage}
                errorMessage={this.props.errorMessage}
                successMessage={this.props.successMessage}
                controlToValidate={this.props.controlToValidate}
                validationAtClient={validateFunction}
                validationAtServer={this.props.validationAtServer}
                ref={this._seq}
                />
        )
    }
});

module.exports = CompareValidator;

//private functions
function validateFunction(validator) {
    return function(value) {
        return value >= validator.props.min && value <= validator.props.max;
    };
}