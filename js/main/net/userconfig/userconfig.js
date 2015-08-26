/**
 * Created by Administrator on 2015/5/30.
 */

//dependencies
var _ = require('lodash');
var uuidGenerator = require('node-uuid');

//private fields
var profile = {
    'os': "android",
    'di': "pc",
    'dv': "1",
    'uid': "212",
    'uuid': uuidGenerator.v1(),
    'ver': "1.0",
    'zip': "1",
    'devn': "Sony Z3+",
    'tk': void 0,
    'msqid': void 0
};
var _configs = ['ver', 'uuid'];

var http2socket = {
    'uid': "msuid",
    'uuid': "devuuid",
    'dv': "dev"
};

var socket2http = {
    'msuid': "uid",
    'devuuid': "uuid",
    'dev': "dv"
};


//core module to export
module.exports = {
    get: function (key) {
        return _.get(profile, _getKey(key));
    },
    set: function (key, value) {
        _.set(profile, _getKey(key), value);
        return this;
    },
    subset: function () {
        var keys = _.flattenDeep(arguments);
        if (_.isEmpty(keys)) {
            return _.assign({}, profile)
        }
        return _.pick(profile, _.map(keys, _getKey));
    },
    socksubset: function () {
        return _.mapKeys(this.subset(arguments), function (value, key) {
            return _.get(http2socket, key) || key;
        })
    },
    getToken: function () {
        return this.get('tk');
    },
    setToken: function (token) {
        return this.set('tk', token);
    },
    getVersion: function () {
        return this.get('ver');
    },
    setVersion: function (version) {
        return this.set('ver', version);
    },
    getUid: function () {
        return this.get('uid');
    },
    setUid: function (uid) {
        return this.set('uid', uid);
    },
    getUuid: function () {
        return this.get('uuid');
    },
    setUuid: function (uuid) {
        return this.set('uuid', uuid);
    },
    configs: function () {
        return _configs;
    }
};

function _getKey(key) {
    return _.get(socket2http, key) || key;
}
