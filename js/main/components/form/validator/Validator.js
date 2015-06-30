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
var Validator = React.createClass({
  propTypes: {
    defaultMessage: React.PropTypes.string,
    errorMessage: React.PropTypes.string,
    successMessage: React.PropTypes.string,
    validationAtServer: React.PropTypes.func,
    validationAtClient: React.PropTypes.func
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

    //first validate at client end
    var isValidAtClient = this.props.validationAtClient
      ? !! this.props.validationAtClient(value)
      : true;

    if (!isValidAtClient) {
      return handleError(this);
    }

    //then validate at server end
    var isValidAtServer = this.props.validationAtServer
      ? this.props.validationAtServer(value)
      : true;

    if (promise.isPrototypeOf(isValidAtServer)) {
      return isValidAtServer.then(function() {
        return handleSuccess(self);
      }, function() {
        return handleError(self);
      });
    }

    if (!isValidAtServer) {
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

module.exports = Validator;

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