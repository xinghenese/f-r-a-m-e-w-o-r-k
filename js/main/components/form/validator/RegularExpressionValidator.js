/**
 * Created by Administrator on 2015/6/26.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var Validator = require('./Validator');
var referable = require('../../mixins/referable');
var validatable = require('../../mixins/validatable');

//private fields

//core module to export
var RegularExpressionValidator = React.createClass({
    mixins: [referable, validatable],
    render: function(){
        if (!_.isArray(this.props.regExp) && !_.isRegExp(this.props.regExp)) {
            console.error('no regExp props found in RegularExpressionValidator');
            return null;
        }
        return (
            <Validator
                className={this.props.className}
                defaultMessage={this.props.defaultMessage}
                errorMessage={this.props.errorMessage}
                successMessage={this.props.successMessage}
                controlsToValidate={this.props.controlsToValidate}
                validationAtClient={validation(this)}
                validationAtServer={this.props.validationAtServer}
                ref={this._seq}
            />
        )
    }
});

module.exports = RegularExpressionValidator;

//module initialization


//private functions
function validation(validator) {
    var regExp = _.toArray(validator.props.regExp);
    var regExpCount = _.size(regExp);

    return function() {
        return _(arguments)
            .toArray()
            .every(function(arg, index) {
                var reg = regExp[index % regExpCount];
                console.log('reg: ', reg);
                return _.isRegExp(reg)
                    ? regExp[index % regExpCount].test(arg)
                    : true;
            });
    }
}