/**
 * Created by Administrator on 2015/6/3.
 */

//dependencies
var EventEmitter = require('browserify/node_modules/events').EventEmitter;
var origin = require('../net/base/origin');

//core module to export
module.exports = origin.extend({}, [], EventEmitter);