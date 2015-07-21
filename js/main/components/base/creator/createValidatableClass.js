/**
 * Created by Administrator on 2015/7/10.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var composite = require('../../../net/base/composite');
var referable = require('./../specs/referable');
var validatable = require('./../specs/validatable');
var createGenerator = require('./createReactClassGenerator');

//private fields


//core module to export
module.exports = createGenerator({
    mixins: [validatable]
});

//module initialization


//private functions
