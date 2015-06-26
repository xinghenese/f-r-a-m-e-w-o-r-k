/**
 * Created by Administrator on 2015/6/25.
 */

//dependencies
var React = require('react');
var promise = require('../../../utils/promise');

//private fields


//core module to export
//use as <Validator
//          defaultMessage
//          errorMessage
//          successMessage
//          controlToValidate
//          pattern
//          atServer
//        />
var validator = module.exports = React.createClass({
  propTypes: {
    defaultMessage: React.PropTypes.string,
    errorMessage: React.PropTypes.string,
    successMessage: React.PropTypes.string,
    pattern: React.PropTypes.func,
    atServer: React.PropTypes.bool
  },
  getDefaultProps: function() {
    return {
      atServer: false
    };
  },
  getInitialState: function() {
    return {message: this.props.defaultMessage};
  },
  validate: function() {
    var self = this;
    var value =  document.getElementById(this.props.controlToValidate).value;
    var isValid = this.props.pattern(value);

    if (this.props.atServer && promise.isPrototypeOf(isValid)) {
      return isValid.then(function() {
        return handleSuccess(self);
      }, function() {
        return handleError(self);
      });
    }
    if (!isValid) {
      return handleError(this);
    }
    return handleSuccess(this);
  },
  render: function(){
    if (!this.props.controlToValidate) {
      return null;
    }
    return <label>{this.state.message}</label>
  }
});

//module initialization


//private functions
function handleError(validator) {
  validator.setState({message: validator.props.errorMessage});
  throw new Error('invalid value');
}

function handleSuccess(validator) {
  validator.setState({message: validator.props.successMessage});
  return true;
}