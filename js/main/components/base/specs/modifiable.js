/**
 * Created by Administrator on 2015/7/17.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var helper = require('../helper/helper');

//private fields


//core module to export
module.exports = {
    render: function(element) {
        if (!React.isValidElement(element)) {
            return null;
        }

        var children = element.props.children;
        var props = null;

        if (_.isFunction(this.descendantsProps)) {
            children = helper.processAllSubNodes(
                //element.props.children would refer to the new children structure
                //while this.props.children holds the original one. so it's necessary
                //to pick out the right root where the traverse starts.
                this.shouldReconstruct && this.reconstructed ? element : this,
                this.descendantsProps,
                this
            );
        }

        if (_.isFunction(this.topOwnedNodeProps)) {
            props = this.topOwnedNodeProps(element);
        }

        return React.cloneElement(
            element,
            props,
            children
        )
    }
};

//module initialization


//private functions
