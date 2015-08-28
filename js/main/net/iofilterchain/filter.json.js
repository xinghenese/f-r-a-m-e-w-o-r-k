/**
 * Created by Administrator on 2015/5/28.
 */

//dependencies
var _ = require('lodash');
var filter = require('./filter');
var formats = require('../../utils/formats');

//core module to export
module.exports = filter.create({
    /**
     * parse the value into a plain object
     * @param value {String}
     * @param options {Object}
     * @returns {Object}
     */
    'processReadable': function (value, options) {
        console.log("[" + formats.formatTime() + "] => " + value);
        return JSON.parse(value.replace(/^[^{]*?\{/, '{').replace(/[\r\n]/gm, ''));
    },
    /**
     * transfer the value into a string
     * @param value {Object}
     * @param options {Object}
     * @returns {String}
     */
    'processWritable': function (value, options) {
        var result = JSON.stringify(value);
        console.log("[" + formats.formatTime() + "] <= " + result);
        return result;
    }
});
