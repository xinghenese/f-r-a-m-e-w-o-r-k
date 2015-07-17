/**
 * Created by Administrator on 2015/7/17.
 */

//dependencies
var React = require('react');

//private fields


//core module to export
module.exports = {
    render: function(element) {
        if (!React.isValidElement(element)) {
            return null;
        }

        var children;
        var props;

        if (_.isFunction(this.descendantsProps)) {
            children = traverse.processAllSubNodes(
                this, this.descendantsProps, this
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
