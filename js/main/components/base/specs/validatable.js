/**
 * Created by Reco on 2015/7/10.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var classNames = require('classnames');
var makeStyle = require('../../../style/styles').makeStyle;
var promise = require('../../../utils/promise');
var defaultStyle = require('../../../style/default');

//private fields
var ValidateState = {
    DEFAULT: 0,
    FAILED: 1,
    SUCCESS: 2
};

//core module to export
module.exports = {
    displayName: 'Validator',
    propTypes: {
        defaultMessage: React.PropTypes.string,
        errorMessage: React.PropTypes.string,
        successMessage: React.PropTypes.string,
        validationAtServer: React.PropTypes.func,
        validationAtClient: React.PropTypes.func
    },
    getInitialState: function () {
        return {validateState: ValidateState.DEFAULT, errorType: -1};
    },
    validate: function () {
        var fieldValues = {};
        var controls = this.props.controlsToValidate;
        controls = _.isArray(controls) ? controls : [controls];

        var values = _.map(controls, function (control) {
            control = document.getElementById(control);
            var field = control.getAttribute('field') || control.id;
            var value = control.value;
            _.set(fieldValues, field, value);
            return value;
        });

        //avoid redundant validation
        if (this.state.validateState == ValidateState.SUCCESS) {
            return handleSuccess(this, fieldValues);
        }
        if (this.state.validateState == ValidateState.FAILED) {
            return handleError(this);
        }

        //first validate at client end
        var isValidAtClient = _.isFunction(this.props.validationAtClient)
            ? !!this.props.validationAtClient.apply(this, values)
            : true;

        console.info('isValidAtClient: ', isValidAtClient);

        if (!isValidAtClient) {
            return handleError(this);
        }

        //then validate at server end
        var isValidAtServer = _.isFunction(this.props.validationAtServer)
            ? this.props.validationAtServer.apply(null, values)
            : true;
        var self = this;

        if (promise.isPrototypeOf(isValidAtServer)) {
            return isValidAtServer.then(function () {
                return handleSuccess(self, fieldValues);
            }, function (err) {
                return handleError(self, err);
            });
        }

        if (!isValidAtServer) {
            return handleError(this);
        }

        return handleSuccess(this, fieldValues);
    },
    render: function () {
        if (!this.props.controlsToValidate) {
            console.error('no controlsToValidate props found in Validator');
            return null;
        }

        var message;
        var isError = false;
        switch (this.state.validateState) {
            case ValidateState.DEFAULT:
                message = this.props.defaultMessage;
                break;
            case ValidateState.FAILED:
                //differ various errorType
                var errMsg = this.props.errorMessage;
                message = !_.isString(errMsg)
                    && errMsg[this.state.errorType]
                    || errMsg;
                isError = true;
                break;
            case ValidateState.SUCCESS:
                message = this.props.successMessage;
                break;
            default:
                message = this.props.defaultMessage;
                break;
        }

        return (
            <label className={classNames(this.props.className, {error: isError})}>{message}</label>
        );
    }
};

//module initialization


//private functions
function doFocus(validator) {
    if (validator.props.controlToFocus) {
        document.getElementById(validator.props.controlToFocus).focus();
    } else {
        var controls = validator.props.controlsToValidate;
        var control = _.isArray(controls) ? _.last(controls) : controls;
        document.getElementById(control).focus();
    }
}

function handleError(validator, error) {
    validator.setState({validateState: ValidateState.FAILED, errorType: error || -1});
    restoreDefaultStyleAfterChange(validator);
    doFocus(validator);
    throw new Error('invalid value');
}

function handleSuccess(validator, data) {
    validator.setState({validateState: ValidateState.SUCCESS});
    return data;
}

function restoreDefaultStyleAfterChange(validator) {
    var controls = validator.props.controlsToValidate;
    controls = _.isArray(controls) ? controls : [controls];
    _.forEach(controls, function (c) {
        var element = document.getElementById(c);
        var onInput = function () {
            element.removeEventListener("input", onInput);
            validator.setState({validateState: ValidateState.DEFAULT});
        };
        element.addEventListener("input", onInput);
    });
}
