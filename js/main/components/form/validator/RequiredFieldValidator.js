/**
 * Created by Administrator on 2015/6/25.
 */

//dependencies
var React = require('react');
var Validator = require('./Validator');

//private fields


//core module to export
var validator = module.exports = React.createClass({
  render: function(){
    return (
      <Validator
        defaultMessage={this.props.defaultMessage}
        errorMessage={this.props.errorMessage}
        successMessage={this.props.successMessage}
        controlToValidate={this.props.controlToValidate}
        pattern={validateFunction}
        atServer={this.props.atServer}
      />
    )
  }
});

//module initialization


//private functions
function validateFunction(value) {
  return value !== void 0 && value !== '';
}