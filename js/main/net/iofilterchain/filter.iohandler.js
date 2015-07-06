/**
 * Created by Administrator on 2015/5/29.
 */

//dependencies
var _ = require('lodash');
var filter = require('./filter');
var userconfig = require('../userconfig/userconfig');
var ConnectionType = require('../connection/connectiontype');
var errors = require('../../constants/errors');

//core module to export
module.exports = filter.create({
    'processReadable': function(msg, options) {
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

        //should extend the logic here to handle various invalid results.
        if (result != 0) {
            console.error('invalid result: ', '{code: ' + result
              + ', reason: ' + _.get(errors, result) + '}');
            throw new Error(result);
        }

        notify(msg);

        return data;
    }
});

//private functions
function notify(msg) {
//  console.log('notify with ', msg);
}