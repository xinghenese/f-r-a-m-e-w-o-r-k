/**
 * Created by Administrator on 2015/6/25.
 */

//dependencies
var React = require('react');
var Validator = require('./Validator');

//private fields
var seq = 'validator';

//core module to export
var RequiredFieldValidator = React.createClass({
  validate: function() {
    console.log('seq: ', seq);
    console.log('this.refs[' + seq + ']', this.refs[seq]);
    return this.refs[seq].validate();
  },
  render: function(){
    return (
      <Validator
        defaultMessage={this.props.defaultMessage}
        errorMessage={this.props.errorMessage}
        successMessage={this.props.successMessage}
        controlToValidate={this.props.controlToValidate}
        validationAtClient={validation}
        ref={seq}
      />
    );
  }
});

module.exports = RequiredFieldValidator;

//module initialization


//private functions
function validation(value) {
  console.log('validating');
  return value !== void 0 && value !== '';
}