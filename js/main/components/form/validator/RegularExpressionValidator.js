/**
 * Created by Administrator on 2015/6/26.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var Validator = require('./Validator');

//private fields


//core module to export
var validator = module.exports = React.createClass({
  render: function(){
    if (!_.isRegExp(this.props.regExp)) {
      return null;
    }
    return (
      <Validator
        defaultMessage={this.props.defaultMessage}
        errorMessage={this.props.errorMessage}
        successMessage={this.props.successMessage}
        controlToValidate={this.props.controlToValidate}
        validationAtClient={validation(this)}
        validationAtServer={this.props.validationAtServer}
      />
    )
  }
});

//module initialization


//private functions
function validation(validator) {
  return function(value) {
    return validator.props.regExp.test(value);
  }
}