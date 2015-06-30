/**
 * Created by Administrator on 2015/6/25.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var promise = require('../../utils/promise');
var Validator = require('./validator/validator');
var RequiredFieldValidator = require('./validator/RequiredFieldValidator');
var CompareValidator = require('./validator/CompareValidator');
var RegularExpressionValidator = require('./validator/RegularExpressionValidator');

//private fields
var ValidatorClasses = [
  RequiredFieldValidator,
  CompareValidator,
  RegularExpressionValidator,
  Validator
];

//core module to export
/**
 * <Form>
 *   <InputBox id=input1/>
 *   <RequiredValidator controlToValidate=input1/>
 * </Form>
 */

//module initialization
var form = module.exports = React.createClass({
  render: function(){
    var i = 0;
    var children = React.Children.map(this.props.children, function(child) {
      return React.cloneElement(child, {ref: 'form-control-' + (i++)});
    });
    return <form onSubmit={submit(this)}>{children}</form>
  }
});

//private functions
function submit(form){
  return function(event){
    _.reduce(form.refs, function(memo, element) {
      if (isValidator(element)) {
        return memo.then(function(){
          return element.validate();
        });
      }
      return memo;
    }, promise.create(0))
    .then(function() {
      form.props.handleSubmit(event);
    });

    event.stopPropagation();
    event.preventDefault();
    return false;
  }
}

function isValidator(element) {
  for (var i = 0, len = ValidatorClasses.length; i < len; i ++) {
    if (element instanceof ValidatorClasses[i]) {
      return true;
    }
  }
  return false;
}