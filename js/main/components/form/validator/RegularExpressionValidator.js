/**
 * Created by Administrator on 2015/6/26.
 */

//dependencies
var _ = require('lodash');
var createValidatableClass = require('../../base/creator/createValidatableClass');

//private fields

//core module to export
module.exports = createValidatableClass({
    displayName: 'RegularExpressionValidator',
    getDefaultProps: function () {
        return {validationAtClient: validation(this)};
    },
    render: function () {
        if (!_.isArray(this.props.regExp) && !_.isRegExp(this.props.regExp)) {
            console.error('no regExp props found in RegularExpressionValidator');
            return null;
        }
    }
});

//module initialization


//private functions
function validation(validator) {
    var regExp = _.toArray(validator.props.regExp);
    var regExpCount = _.size(regExp);

    return function () {
        return _(arguments)
            .toArray()
            .every(function (arg, index) {
                var reg = regExp[index % regExpCount];
                console.log('reg: ', reg);
                return _.isRegExp(reg)
                    ? regExp[index % regExpCount].test(arg)
                    : true;
            });
    }
}
