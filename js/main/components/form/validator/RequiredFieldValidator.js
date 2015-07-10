/**
 * Created by Administrator on 2015/6/25.
 */
'use strict';

//dependencies
var _ = require('lodash');
var createValidatableClass = require('../../base/creator/createValidatableClass');

//private fields

//core module to export
module.exports = createValidatableClass({
    displayName: 'RequiredFieldValidator',
    getDefaultProps: function() {
        return {validationAtClient: validation};
    }
});

//module initialization


//private functions
function validation() {
//    console.log('validating');
    return _(arguments)
        .toArray()
        .every(function(arg) {
            return arg !== void 0 && arg !== '';
        });
}