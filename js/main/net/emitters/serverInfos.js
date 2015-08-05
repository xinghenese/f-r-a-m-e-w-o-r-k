/**
 * Created by Administrator on 2015/6/16.
 */

//dependencies
var eventemitter = require('../../utils/eventemitter.thenable');

var timestamp = +(new Date());
var events = {
    'serverInfos': "serverInfos_" + timestamp
};

var emitter = module.exports = eventemitter.create();
emitter.events = events;
