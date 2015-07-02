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
var FunctionBasedValidator = require('./validator/FunctionBasedValidator');

//private fields
var ValidatorClasses = [
    RequiredFieldValidator,
    CompareValidator,
    RegularExpressionValidator,
    FunctionBasedValidator,
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
var Form = React.createClass({
    render: function() {
        var i = 0;
        var children = React.Children.map(this.props.children, function(child) {
            var seq = i++;
            return React.cloneElement(child, {
                ref: 'form-control-' + (seq),
                seq: seq
            });
        });
        return (
            <form
                onSubmit={submit(this)}
                className={this.props.className}
                style={this.props.style}
                >
                {children}</form>
        )
    }
});

module.exports = Form;

//private functions
function submit(form) {
    return function f(event) {
        walkRefs(form).then(function() {
            form.props.onSubmit(event);
        });

        event.stopPropagation();
        event.preventDefault();
        if (!("stopPropagation" in event || "preventDefault" in event)) {
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
    for (var i = 0, len = ValidatorClasses.length; i < len; i++) {
        if (element instanceof ValidatorClasses[i]) {
            return true;
        }
    }
    return false;
}