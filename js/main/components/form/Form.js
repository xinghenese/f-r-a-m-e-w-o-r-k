/**
 * Created by Administrator on 2015/6/25.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var promise = require('../../utils/promise');
var RequiredFieldValidator = require('./validator/RequiredFieldValidator');
var CompareValidator = require('./validator/CompareValidator');
var RegularExpressionValidator = require('./validator/RegularExpressionValidator');
var CustomValidator = require('./validator/CustomValidator');
var FunctionBasedValidator = require('./validator/FunctionBasedValidator');
var objects = require('../../utils/objects');

//private fields
var ValidatorClasses = [
    RequiredFieldValidator,
    CompareValidator,
    RegularExpressionValidator,
    CustomValidator,
    FunctionBasedValidator
];

//core module to export
/**
 * <Form>
 *   <InputBox id=input1/>
 *   <RequiredValidator controlsToValidate=input1/>
 * </Form>
 */

//module initialization
var Form = React.createClass({
    render: function(){
        var i = 0;
        var count = React.Children.count(this.props.children);
        var children = React.Children.map(this.props.children, function(child) {
            var seq = i ++;
            return React.cloneElement(child, {
                ref: 'form-control-' + (seq),
                seq: seq,
                count: count
            });
        });
        return (
            <form
                onSubmit={submit(this)}
                className={this.props.className}
                style={this.props.style}
            >
            {children}
            </form>
        )
    }
});

module.exports = Form;

//private functions
function submit(form){
    return function f(event) {
        walkRefs(form).then(function() {
            form.props.onSubmit(event);
        });

        if (!objects.preventDefault(event)) {
            return false;
        }
    }
}

function walkRefs(root) {
    return _.reduce(root.refs, function(memo, element) {
        if (isValidator(element)) {
            return memo.then(function() {
                return element.validate();
            });
        }
        if (!_.isEmpty(element.refs)) {
            return memo.then(function() {
                return walkRefs(element);
            });
        }
        return memo;
    }, promise.create(0))
}

function isValidator(element) {
    for (var i = 0, len = ValidatorClasses.length; i < len; i ++) {
        if (element instanceof ValidatorClasses[i]) {
            return true;
        }
    }
    return false;
}