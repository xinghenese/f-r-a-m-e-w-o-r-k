/**
 * Created by Administrator on 2015/5/29.
 */

//dependencies
var _ = require('lodash');
var filter = require('./filter');
var ConnectionType = require('../connection/connectiontype');
var errors = require('../../constants/errors');

//core module to export
module.exports = filter.extend({
    'processReadable': function (msg, options) {
        var connectionType = options.connectionType;
        var result;
        var data;
        var tag;

        if (connectionType == ConnectionType.HTTP) {
            result = +msg.r;
            data = msg.data;
        } else if (connectionType == ConnectionType.SOCKET) {
            result = +_.isEmpty(msg);
            tag = '' + _.keys(msg)[0];
            data = {
                'tag': tag,
                'data': _.get(msg, tag)
            };
        }

        if (result != 0) {
            throw result;
        }

        notify(msg);

        return data;
    }
});

//private functions
function notify(msg) {
//  console.log('notify with ', msg);
}
