/**
 * Created by Administrator on 2015/5/29.
 */

//dependencies
var origin = require('../base/origin');
var chain = require('../iofilterchain/chain');

//core module to export
module.exports = origin.extend({
    /**
     * read data from the connection and then process it with filter chain.
     * @param msg {Object}
     * @param options {Object}
     * @returns {Q.Promise}
     */
    'read': function (msg, options) {
        return chain.filterRead(msg, options);
    },
    /**
     * write data processed with filter chain to the connection.
     * @param msg {Object}
     * @param options {Object}
     * @returns {Q.Promise}
     */
    'write': function (msg, options) {
        return chain.filterWrite(msg, options);
    }
});
