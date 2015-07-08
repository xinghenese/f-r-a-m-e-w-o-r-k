/**
 * Created by Administrator on 2015/6/25.
 */
'use strict';

//dependencies
var _ = require('lodash');
var React = require('react');
var Validator = require('./Validator');
var referable = require('../../mixins/referable');
var validatable = require('../../mixins/validatable');

//private fields

//core module to export
var RequiredFieldValidator = React.createClass({
    mixins: [referable, validatable],
    render: function(){
        return (
            <Validator
                className={this.props.className}
                defaultMessage={this.props.defaultMessage}
                errorMessage={this.props.errorMessage}
                successMessage={this.props.successMessage}
                controlsToValidate={this.props.controlsToValidate}
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