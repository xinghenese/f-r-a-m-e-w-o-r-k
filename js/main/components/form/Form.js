/**
 * Created by Administrator on 2015/6/25.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var promise = require('../../utils/promise');

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
    _(form.props.children)
      .toArray()
      .reduce(function(memo, child) {
        if(_.indexOf(ValidatorTypes, child.type) > -1){
          return memo.then(function(){
            return child.validate();
          });
        }
        return memo;
      }, promise.create(0))
      .value()
      .then(function() {
        form.props.handleSubmit(event);
      });

    event.preventDefault();
    return false;
  }
}