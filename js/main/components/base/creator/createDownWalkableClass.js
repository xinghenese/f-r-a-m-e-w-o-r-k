/**
 * Created by Administrator on 2015/7/10.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var composite = require('../../../net/base/composite');
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
