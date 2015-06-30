/**
 * Created by Administrator on 2015/6/26.
 */

//dependencies
var React = require('react');
var Validator = require('./Validator');

//private fields


//core module to export
var validator = module.exports = React.createClass({
  render: function(){
    if (!_.isUndefined(this.props.max) && !_.isUndefined(this.props.min)) {
      return null;
    }
    return (
      <Validator
        defaultMessage={this.props.defaultMessage}
        errorMessage={this.props.errorMessage}
        successMessage={this.props.successMessage}
        controlToValidate={this.props.controlToValidate}
        validationAtClient={validateFunction}
        validationAtServer={this.props.validationAtServer}
      />
      )
  }
});

//module initialization


//private functions
function validateFunction(validator) {
  return function(value) {
    return value >= validator.props.min && value <= validator.props.max;
  };
}