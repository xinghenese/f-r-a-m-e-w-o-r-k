/**
 * Created by Administrator on 2015/6/26.
 */

//dependencies
var _ = require('lodash');
var createValidatableClass = require('../../base/creator/createValidatableClass');

//private fields

//core module to export
module.exports = createValidatableClass({
    displayName: 'CompareValidator',
    getDefaultProps: function() {
        return {validationAtClient: validation(this)};
    },
    render: function() {
        if (!_.isUndefined(this.props.max) && !_.isUndefined(this.props.min)) {
            console.error('no max or min props found in CompareValidator');
            return null;
        }
    }
});

//private functions
function validation(validator) {
    return function(value) {
        return value >= validator.props.min && value <= validator.props.max;
    };
}