/**
 * Created by Administrator on 2015/6/26.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var Validator = require('./Validator');

//private fields
var seq = 'regexp-validator-';
var index = 0;

//core module to export
var RegularExpressionValidator = React.createClass({
  _seq: seq + (index ++),
  validate: function() {
    console.log('seq: ', this._seq);
    console.log('this.refs[' + this._seq + ']', this.refs[this._seq]);
    return this.refs[this._seq].validate();
  },
  render: function(){
    if (!_.isRegExp(this.props.regExp)) {
      console.error('no regExp props found in RegularExpressionValidator');
      return null;
    }
    return (
      <Validator
        className={this.props.className}
        defaultMessage={this.props.defaultMessage}
        errorMessage={this.props.errorMessage}
        successMessage={this.props.successMessage}
        controlToValidate={this.props.controlToValidate}
        validationAtClient={validation(this)}
        validationAtServer={this.props.validationAtServer}
        ref={this._seq}
      />
    )
  }
});

module.exports = RegularExpressionValidator;

//module initialization


//private functions
function validation(validator) {
  return function(value) {
    return validator.props.regExp.test(value);
  }
}