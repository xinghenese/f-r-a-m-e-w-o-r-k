/**
 * Created by Administrator on 2015/6/25.
 */

//dependencies
var React = require('react');
var Validator = require('./Validator');

//private fields


//core module to export
var RequiredFieldValidtor = React.createClass({
  render: function(){
    return (
      <Validator
        defaultMessage={this.props.defaultMessage}
        errorMessage={this.props.errorMessage}
        successMessage={this.props.successMessage}
        controlToValidate={this.props.controlToValidate}
        pattern={validation}
        atServer={false}
      />
    )
  }
});

module.exports = RequiredFieldValidtor;

//module initialization


//private functions
function validation(value) {
  return value !== void 0 && value !== '';
}