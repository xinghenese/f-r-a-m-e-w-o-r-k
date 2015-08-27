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
    submit: function (event) {
        this.walkDescendants(validate).then(_.bind(function (data) {
            event.data = data;
            this.props.onSubmit(event);
            React.findDOMNode(this).reset();
        }, this));

        event.stopPropagation();
        event.preventDefault();
        event.returnValue = false;
    },
    render: function () {
        return (
            <form
                onSubmit={this.submit}
                {..._.omit(this.props, ['onSubmit'])}
                >
                {this.props.children}
            </form>
        )
    }
});

//private functions
function validate(element, result) {
    result = result || promise.create({});

    if (isValidator(element)) {
        return result.then(function (data) {
            var values = element.validate();
            if (promise.isPrototypeOf(values)) {
                return values.then(function (newData) {
                    return _.assign(data, newData);
                })
            }
            return _.assign(data, values);
        });
    }

    //TODO: filter the values of non-input controls
    var control = React.findDOMNode(element);
    var value = element.value || control.value || control.textContent || control.innerText;
    var field = element.props.field || element.props.id;
    if (value && field) {
        element.value && (element.value = '');
        return result.then(function (data) {
            return _.set(data, field, value);
        })
    }

    return result;
}

function isValidator(element) {
    for (var i = 0, len = ValidatorClassString.length; i < len; i++) {
        if (element.constructor.displayName === ValidatorClassString[i]) {
            return true;
        }
    }
    return false;
}
