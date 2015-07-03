/**
 * Created by Administrator on 2015/7/3.
 */

//dependencies
var React = require('react');
var Validator = require('./Validator');

//private fields
var seq = 'custom-validator-';
var index = 0;

//core module to export
var CustomValidator = React.createClass({
  validate: function() {
    console.log('this.refs[' + this._seq + ']', this.refs[this._seq]);
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
        validationAtClient={this.props.validationAtClient}
        validationAtServer={this.props.validationAtServer}
        style={this.props.style}
        ref={this._seq}
      />
      );
  }
});

module.exports = CustomValidator;

//module initialization


//private functions
