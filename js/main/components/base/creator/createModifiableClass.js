/**
 * Created by Administrator on 2015/7/17.
 */

//dependencies
var createGenerator = require('./createReactClassGenerator');
var modifiable = require('./../specs/modifiable');

//private fields


//core module to export
module.exports = createGenerator({
    mixins: [modifiable]
});

//module initialization


//private functions
