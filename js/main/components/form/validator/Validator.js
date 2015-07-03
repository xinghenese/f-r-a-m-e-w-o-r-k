/**
 * Created by Administrator on 2015/6/25.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var makeStyle = require('../../../style/styles').makeStyle;
var promise = require('../../../utils/promise');
var defaultStyle = require('../../../style/default');

//private fields
var ValidateState = {
    NEVER: 0,
    FAILED: 1,
    SUCCESS: 2
};
var seq = 'custom-validator-';
var index = 0;

//core module to export
//use as <Validator
//          defaultMessage
//          errorMessage
//          successMessage
//          controlToValidate
//          validationAtClient
//          validationAtServer
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
        return {validateState: ValidateState.NEVER, errorType: -1};
    },
    validate: function() {
        var self = this;
        var controls = this.props.controlToValidate;
        controls = _.isArray(controls) ? controls : [controls];

//        console.log('controls: ', controls);

        var values = _.map(controls, function(control) {
            return document.getElementById(control).value;
        });

//        console.log('values: ', values);

        //first validate at client end
        var isValidAtClient = _.isFunction(this.props.validationAtClient)
            ? !! this.props.validationAtClient.apply(this, values)
            : true;

        if (!isValidAtClient) {
            return handleError(this);
        }

        //then validate at server end
        var isValidAtServer = _.isFunction(this.props.validationAtServer)
            ? this.props.validationAtServer(this, values)
            : true;

        if (promise.isPrototypeOf(isValidAtServer)) {
            return isValidAtServer.then(function() {
                return handleSuccess(self);
            }, function(err) {
                return handleError(self, err);
            });
        }

        if (!isValidAtServer) {
            return handleError(this);
        }

        return handleSuccess(this);
    },
    render: function() {
        if (!this.props.controlToValidate) {
            console.error('no controlToValidate props found in Validator');
            return null;
        }
        var style;
        var message;

        switch (this.state.validateState) {
            case ValidateState.NEVER:
                message = this.props.defaultMessage;
                break;
            case ValidateState.FAILED:
                //differ various errorType
                var errMsg = this.props.errorMessage;
                message = !_.isString(errMsg)
                    && errMsg[this.state.errorType]
                    || errMsg;
                style = defaultStyle.errorText;
                break;
            case ValidateState.SUCCESS:
                message = this.props.successMessage;
                break;
            default:
                message = this.props.defaultMessage;
                break;
        }

        return (
            <label
                style={makeStyle(this.props.style, style)}
                className={this.props.className}>
                {message}
            </label>
        )
    }
});

module.exports = Validator;

//module initialization


//private functions
function handleError(validator, error) {
    validator.setState({validateState: ValidateState.FAILED, errorType: error || -1});
    document.getElementById(validator.props.controlToValidate).focus();
    throw new Error('invalid value');
}

function handleSuccess(validator) {
    validator.setState({validateState: ValidateState.SUCCESS});
    return true;
}