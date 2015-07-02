/**
 * Created by Administrator on 2015/6/25.
 */

//dependencies
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
        return {validateState: ValidateState.NEVER};
    },
    validate: function() {
        var self = this;
        var value = document.getElementById(this.props.controlToValidate).value;

        //first validate at client end
        var isValidAtClient = this.props.validationAtClient
            ? !!this.props.validationAtClient(value)
            : true;

        if (!isValidAtClient) {
            return handleError(this);
        }

        //then validate at server end
        var isValidAtServer = this.props.validationAtServer
            ? this.props.validationAtServer(value)
            : true;

        if (promise.isPrototypeOf(isValidAtServer)) {
            return isValidAtServer.then(function() {
                return handleSuccess(self);
            }, function() {
                return handleError(self);
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
                message = this.props.errorMessage;
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
function handleError(validator) {
    validator.setState({validateState: ValidateState.FAILED});
    document.getElementById(validator.props.controlToValidate).focus();
    throw new Error('invalid value');
}

function handleSuccess(validator) {
    validator.setState({validateState: ValidateState.SUCCESS});
    return true;
}