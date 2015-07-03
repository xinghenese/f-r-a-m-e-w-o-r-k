/**
 * Created by Administrator on 2015/6/25.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var Validator = require('./Validator');

//private fields
var seq = 'required-validator-';
var index = 0;

//core module to export
var RequiredFieldValidator = React.createClass({
    validate: function() {
//        console.log('this.refs[' + this._seq + ']', this.refs[this._seq]);
        return this.refs[this._seq].validate();
    },
    componentWillMount: function() {
        this._seq = seq + (index ++);
    },
    render: function(){
        return (
            <Validator
                className={this.props.className}
                defaultMessage={this.props.defaultMessage}
                errorMessage={this.props.errorMessage}
                successMessage={this.props.successMessage}
                controlToValidate={this.props.controlToValidate}
                validationAtClient={validation}
                style={this.props.style}
                ref={this._seq}
            />
        );
    }
});

module.exports = RequiredFieldValidator;

//module initialization


//private functions
function validation() {
//    console.log('validating');
    return _(arguments)
        .toArray()
        .every(function(arg) {
            return arg !== void 0 && arg !== '';
        });
}