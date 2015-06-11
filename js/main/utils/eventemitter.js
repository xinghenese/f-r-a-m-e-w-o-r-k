/**
 * Created by Administrator on 2015/6/3.
 */

//dependencies
var EventEmitter = require('browserify/node_modules/events').EventEmitter;
var originify = require('../net/base/originify');

//core module to export
module.exports = originify(EventEmitter);