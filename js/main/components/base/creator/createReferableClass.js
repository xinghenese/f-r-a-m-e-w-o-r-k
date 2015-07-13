/**
 * Created by Reco on 2015/7/9.
 */

//dependencies
var React = require('react');
var referable = require('./../specs/referable');
var createGenerator = require('./createReactClassGenerator');

//private fields

//core module to export
module.exports = createGenerator({
    mixins: [referable]
});

//module initialization


//private functions