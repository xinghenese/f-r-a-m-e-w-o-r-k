/**
 * Created by Administrator on 2015/7/17.
 */

//dependencies
var React = require('react');
var helper = require('../helper/helper');

//private fields


//core module to export
module.exports = {
    componentWillMount: function() {
        this.shouldReconstruct = true;
        this.reconstructed = false;
    },
    render: function(element) {
        if (!React.isValidElement(element)) {
            return null;
        }
        this.reconstructed = true;

        return helper.reconstruct(element, this);
    }
};

//module initialization


//private functions
