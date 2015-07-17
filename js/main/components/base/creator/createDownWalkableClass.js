/**
 * Created by Administrator on 2015/7/10.
 */

//dependencies
var referable = require('./../specs/referable');
var createGenerator = require('./createReactClassGenerator');
var descendantsWalkable = require('./../specs/descendantswalkable');


//private fields


//core module to export
module.exports = createGenerator({
    mixins: [descendantsWalkable, referable]
});

//module initialization


//private functions
