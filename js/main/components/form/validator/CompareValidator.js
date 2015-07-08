/**
 * Created by Administrator on 2015/6/26.
 */

//dependencies
var React = require('react');
var Validator = require('./Validator');
var referable = require('../../mixins/referable');
var validatable = require('../../mixins/validatable');

//private fields

//core module to export
var CompareValidator = React.createClass({
    mixins: [referable, validatable],
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
                controlsToValidate={this.props.controlsToValidate}
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