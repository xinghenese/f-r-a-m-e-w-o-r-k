/**
 * Created by Administrator on 2015/5/28.
 */

//dependencies
var _ = require('lodash');
var filter = require('./filter');
var userconfigs = require('../userconfig/userconfig');

//core module to export
module.exports = filter.create({
    /**
     * parse the value into a plain object
     * @param value {String}
     * @param options {Object}
     * @returns {Object}
     */
    'processReadable': function(value, options) {
        var result = JSON.parse(value.replace(/^[^{]*?\{/, '{').replace(/[\r\n]/gm, ''));
        console.log("received - " + result);
        return result;
    },
    /**
     * transfer the value into a string
     * @param value {Object}
     * @param options {Object}
     * @returns {String}
     */
    'processWritable': function(value, options) {
        var result = JSON.stringify(value);
        console.log("writing - " + result);
        return result;
    }
});