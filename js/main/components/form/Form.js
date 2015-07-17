/**
 * Created by Administrator on 2015/6/25.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var promise = require('../../utils/promise');
var objects = require('../../utils/objects');
var makeStyle = require('../../style/styles').makeStyle;
var createDownWalkableClass = require('../base/creator/createDownWalkableClass');

//private fields
var ValidatorClassString = [
    'RequiredFieldValidator',
    'CompareValidator',
    'RegularExpressionValidator',
    'CustomValidator',
    'FunctionBasedValidator'
];

//core module to export
/**
 * <Form>
 *   <InputBox id=input1/>
 *   <RequiredValidator controlsToValidate=input1/>
 * </Form>
 */

//module initialization
module.exports = createDownWalkableClass({
    displayName: 'Form',
    render: function(){
        return (
            <form
                onSubmit={submit(this)}
                className={this.props.className}
                style={makeStyle(this.props.style)}
            >
                {this.props.children}
            </form>
        )
    }
});

//private functions
function submit(form) {
    return function(event) {
        form.walkDescendants(validate).then(function(data) {
            event.data = data;
            form.props.onSubmit(event);
            React.findDOMNode(form).reset();
        });

        event.stopPropagation();
        event.preventDefault();
        event.returnValue = false;
    };
}

function validate(element, result) {
    result = result || promise.create({});

    if (isValidator(element)) {
        return result.then(function(data) {
            var values = element.validate();
            if (promise.isPrototypeOf(values)) {
                return values.then(function(newData) {
                    return _.assign(data, newData);
                })
            }
            return _.assign(data, values);
        });
    }

    //TODO: filter the values of non-input controls
    var control = React.findDOMNode(element);
    var value = control.value || control.textContent || control.innerText;
    var field = element.props.field || element.props.id;
    if (value && field) {
        return result.then(function(data) {
            return _.set(data, field, value);
        })
    }

    return result;
}

function isValidator(element) {
    for (var i = 0, len = ValidatorClassString.length; i < len; i ++) {
        if (element.constructor.displayName === ValidatorClassString[i]) {
            return true;
        }
    }
    return false;
}