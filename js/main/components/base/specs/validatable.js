/**
 * Created by Reco on 2015/7/10.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var classNames = require('classnames');
var promise = require('../../../utils/promise');
var errors = require('../../../constants/errors');

//private fields
var ValidateState = {
    DEFAULT: 0,
    FAILED: 1,
    SUCCESS: 2
};
var DEFAULT_ERROR_TYPE = 0;

//core module to export
module.exports = {
    displayName: 'Validator',
    propTypes: {
        defaultMessage: React.PropTypes.string,
        errorMessage: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
        successMessage: React.PropTypes.string,
        validationAtServer: React.PropTypes.func,
        validationAtClient: React.PropTypes.func
    },
    getInitialState: function () {
        return {validateState: ValidateState.DEFAULT, errorType: DEFAULT_ERROR_TYPE};
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
            return handleError(this, DEFAULT_ERROR_TYPE);
        }

        //first validate at client end
        var isValidAtClient = !_.isFunction(this.props.validationAtClient);

        if (!isValidAtClient) {
            try {
                isValidAtClient = this.props.validationAtClient.apply(null, values);
            } catch (err) {
                return handleError(this, err.message || err);
            }
        }

        if (!isValidAtClient) {
            return handleError(this, DEFAULT_ERROR_TYPE);
        }

        //then validate at server end
        var isValidAtServer = !_.isFunction(this.props.validationAtServer);

        if (!isValidAtServer) {
            try {
                isValidAtServer = this.props.validationAtServer.apply(null, values);
                if (promise.isPrototypeOf(isValidAtServer)) {
                    return isValidAtServer.then(_.bind(function () {
                        return handleSuccess(this, fieldValues);
                    }, this), _.bind(function (err) {
                        return handleError(this, err);
                    }, this));
                }
            } catch (err) {
                return handleError(this, err.message || err);
            }
        }

        if (!isValidAtServer) {
            return handleError(this, DEFAULT_ERROR_TYPE);
        }

        return handleSuccess(this, fieldValues);
    },
    render: function () {
        if (!this.props.controlsToValidate) {
            console.error('no controlsToValidate props found in Validator');
            return null;
        }

        var message;
        switch (this.state.validateState) {
            case ValidateState.DEFAULT:
                message = this.props.defaultMessage;
                break;
            case ValidateState.FAILED:
                //differ various errorType
                var errMsg = this.props.errorMessage;
                var errType = this.state.errorType;
                message = _.isObject(errMsg)
                    ? errMsg[errType] || errType || _.values(errMsg)[0]
                    : errType && errors[errType] || errType || errMsg;
                break;
            case ValidateState.SUCCESS:
                message = this.props.successMessage;
                break;
            default:
                message = this.props.defaultMessage;
                break;
        }

        return (
            <label className={classNames(
                this.props.className,
                {error: this.state.validateState === ValidateState.FAILED}
                )}>
                {message}
            </label>
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
    validator.setState({validateState: ValidateState.FAILED, errorType: error || DEFAULT_ERROR_TYPE});
    restoreDefaultStyleAfterChange(validator);
    doFocus(validator);
    throw new Error(error.message || error);
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
