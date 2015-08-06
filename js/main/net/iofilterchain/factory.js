/**
 * Created by Administrator on 2015/5/29.
 *
 * factory for filter creation.
 */

//dependencies
var filter = require('./filter');
var json = require('./filter.json');
var codec = require('./filter.codec');
var crypto = require('./filter.cipher');
var zipper = require('./filter.zipper');
var wrapper = require('./filter.wrapper');
var assembly = require('./filter.assembly');
var iohandler = require('./filter.iohandler');
var token = require('./filter.token');

//core module to export
module.exports = {
    createFilter: function (tag) {
        switch (tag) {
            case 'json':
                return json;
            case 'codec':
                return codec;
            case 'zipper':
                return zipper;
            case 'cipher':
                return crypto;
            case 'wrapper':
                return wrapper;
            case 'assembly':
                return assembly;
            case 'iohandler':
                return iohandler;
            case 'token':
                return token;
            default:
                return filter.create();
        }
    }
};
