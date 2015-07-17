/**
 * Created by Administrator on 2015/7/17.
 */

//dependencies
var createGenerator = require('./createReactClassGenerator');
var reconstructable = require('./../specs/reconstructable');

//private fields


//core module to export
module.exports = createGenerator({
    mixins: [reconstructable]
});

//module initialization


//private functions
