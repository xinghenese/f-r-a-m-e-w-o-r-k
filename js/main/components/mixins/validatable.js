/**
 * Created by Administrator on 2015/7/8.
 */

//dependencies
var _ = require('lodash');

//private fields


//core module to export
module.exports = {
    validate: function() {
        var ref = this.refs[this._seq];

        if (ref && _.isFunction(ref.validate)) {
            return ref.validate();
        }
        return true;
    }
};

//module initialization


//private functions
