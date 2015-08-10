/**
 * Created by Reco on 2015/7/10.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var composite = require('../../../net/base/composite');
var policyName = composite.policyName;

//private fields
var defaultConflictPolicy = {
    getInitialState: policyName.MERGE,
    getDefaultProps: policyName.MERGE,
    descendantsProps: policyName.MERGE,
    topOwnedNodeProps: policyName.MERGE,
    componentWillMount: policyName.SEQUENCE,
    componentDidMount: policyName.SEQUENCE,
    componentWillReceiveProps: policyName.SEQUENCE,
    componentWillUpdate: policyName.SEQUENCE,
    componentDidUpdate: policyName.SEQUENCE,
    componentWillUnmount: policyName.SEQUENCE,
    componentDidUnmount: policyName.SEQUENCE,
    render: policyName.CHAIN_RIGHT,
    renderItem: policyName.CHAIN_RIGHT
};

//core module to export
module.exports = mixinSpecs;

//module initialization


//private functions
function mixinSpecs(configs, policy, priority) {
    return cleanSpecs(
        composite.create(configs, policy || defaultConflictPolicy)
        || configs
    );
}

function cleanSpecs(spec) {
    return _.reduce(spec, function (memo, value, key) {
        if (isSet(value)) {
            return _.set(memo, key, value);
        }
        return memo;
    }, {});
}

function isSet(value) {
    if (!value) {
        return false;
    }
    if (_.isFunction(value)) {
        return true;
    }
    return !_.isEmpty(value);
}
