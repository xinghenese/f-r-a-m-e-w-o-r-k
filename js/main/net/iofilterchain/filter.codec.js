/**
 * Created by Administrator on 2015/5/28.
 */

//dependencies
var _ = require('lodash');
var filter = require('./filter');

//core module to export
module.exports = filter.extend({
    'notifyConfig': function (cfg) {
        if (!_.isUndefined(cfg.needEncode)) {
            this.enableWrite = !!cfg.needEncode;
        }
        if (!_.isUndefined(cfg.needDecode)) {
            this.enableRead = !!cfg.needDecode;
        }
    }
});
