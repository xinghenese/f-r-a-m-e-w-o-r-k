/**
 * Created by Administrator on 2015/6/3.
 */

//dependencies
var EventEmitter = require('events').EventEmitter;
var originify = require('../net/base/originify');

// exports
module.exports = originify(EventEmitter);

// module initialization
var addListener = EventEmitter.prototype.addListener;
var on = EventEmitter.prototype.on;
var removeListener = EventEmitter.prototype.removeListener;
