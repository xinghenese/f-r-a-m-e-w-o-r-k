/**
 * Created by Administrator on 2015/7/17.
 */

//dependencies
var React = require('react');
var helper = require('../helper/helper');

//private fields


//core module to export
module.exports = {
    render: function(element) {
        if (!React.isValidElement(element)) {
            return null;
        }

        return helper.reconstruct(element, this);
    }
};

//module initialization


//private functions
