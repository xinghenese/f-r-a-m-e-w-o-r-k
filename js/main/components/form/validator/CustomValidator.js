/**
 * Created by Administrator on 2015/7/3.
 */

//dependencies
var React = require('react');
var Validator = require('./Validator');
var referable = require('../../mixins/referable');
var validatable = require('../../mixins/validatable');

//private fields

//core module to export
var CustomValidator = React.createClass({
  mixins: [referable, validatable],
  render: function(){
    return (
      <Validator
        className={this.props.className}
        defaultMessage={this.props.defaultMessage}
        errorMessage={this.props.errorMessage}
        successMessage={this.props.successMessage}
        controlsToValidate={this.props.controlsToValidate}
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
