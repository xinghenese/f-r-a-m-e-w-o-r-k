/**
 * Created by Administrator on 2015/5/28.
 */
//dependencies
var _ = require('lodash');
var querystring = require('querystring');
var filter = require('./filter');

//core module to export
module.exports = filter.create({
    'processWritable': function (value, options) {
        if (options.needWrap) {
            return queryStringify(value);
        }
        return value;
    },
    'processReadable': function (value, options) {
        if (options.needUnwrap) {
            return decodeURIComponent(value.replace(/[\r\n\s]/gm, ''));
        }
        return value;
    }
});

//private functions.
function queryStringify(msg) {
    return querystring.stringify(_.assign(
        {data: String(msg)},
        require('../../stores/accountstore').getProfile(['ver', 'uuid'])
    ));
}
