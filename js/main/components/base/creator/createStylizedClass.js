/**
 * Created by Administrator on 2015/7/20.
 */

//dependencies
var createGenerator = require('./createReactClassGenerator');
var stylizable = require('../specs/stylizable');

//private fields


//core module to export
module.exports = createGenerator({
    mixins: [stylizable]
});

//module initialization


//private functions
