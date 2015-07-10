/**
 * Created by Reco on 2015/7/9.
 */

//dependencies
var composite = require('../../../net/base/composite');
var referable = require('./../specs/referable');
//var validatable = require('./specs/validatable');
var createGenerator = require('./createReactClassGenerator');

//private fields

//core module to export
module.exports = createGenerator({
    mixins: [referable]
});

//module initialization


//private functions