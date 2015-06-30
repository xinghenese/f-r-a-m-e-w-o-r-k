/**
 * Created by Administrator on 2015/6/25.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var promise = require('../../utils/promise');
var RequiredFieldValidator = require('./validator/RequiredFieldValidator');

//private fields
var ValidatorTypes = [
  "RequiredFieldValidator",
  "RangeValidator",
  "CompareValidator",
  "CustomValidator",
  "RegularExpressionValidator"
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
    return <form onSubmit={submit(this)}>{this.props.children}</form>
  }
});

//private functions
function submit(form){
  return function(event){
    console.log('start to submit');
    console.log('required: ', RequiredFieldValidator);
    _(form.props.children)
      .toArray()
      .reduce(function(memo, child) {
        console.log('child', child);
//        console.log('child.type', child.type);

        if(child.type === RequiredFieldValidator){
          console.log('start to validate');
          return memo.then(function(){
            return child.validate();
          });
        }
        return memo;
      }, promise.create(0))
//      .value()

      .then(function() {
        form.props.handleSubmit(event);
      });

    event.stopPropagation();
    event.preventDefault();
    return false;
  }
}