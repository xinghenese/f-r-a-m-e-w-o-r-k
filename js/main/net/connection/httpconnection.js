/**
 * Created by Administrator on 2015/5/29.
 */

//dependencies
var _ = require('lodash');
var State = require('./connectionstate');
var session = require('./iosession');
var http = require('./http');
var connection = require('./connection');
var keyExchange = require('../crypto/factory').createKeyExchange();
var userconfig = require('../userconfig/userconfig');
var Config = require('../../etc/config');
var ConnectionType = require('./connectiontype');
var UserAgent = require('../../utils/useragent');

//private const fields
var PUBLIC_KEY_FIELD = "pk";
var UUID_FILED = "uuid";
var TOKEN_FIELD = "tk";
//var DEFAULT_ROOT = "http://dev.api.topcmm.net/";
var DEFAULT_ROOT = "http://api.shanliao.com/";
var DEFAULT_CONFIG = {
    'needEncrypt': true,
    'needDecrypt': true,
    'needCompress': false,
    'needDecompress': true,
    'needEncode': false,
    'needDecode': false,
    'needToken': true,
    'needWrap': true,
    'needUnwrap': true,
    'encryptKey': "",
    'connectionType': ConnectionType.HTTP
};

//private fields.
var omitConfig = ["connectionType", "encryptKey"];
var state = State.INITIALIZING;
var isAuthorized = false;
var isLoggedIn = false;
var authorizePromise = null;
var loginPromise = null;

//core module to export
var httpconnection = module.exports = connection.extend({
    'login': function (data) {
        return this.request(data).then(function (value) {
            var token = _.get(value, TOKEN_FIELD);
            userconfig.setToken(token);
            isLoggedIn = true;
            return value;
        });
    },

    /**
     * unify the HTTP request interface by means of HTTP GET or HTTP POST
     * @param packet{Object|String}
     * @param options{Object}
     * @returns {Q.Promise}
     */
    'request': function (packet, options) {
        return authorize().then(function (value) {
            var root;
            var url;
            var data;

            if (!packet || _.isEmpty(packet)) {
                throw new Error("empty packet to be sent via http");
            }

            root = "" + (packet.root || DEFAULT_ROOT);
            url = root + (packet.url || packet.path || packet);
            data = packet.data;

            options = _.assign({}, DEFAULT_CONFIG, _.omit(options, omitConfig));

            if (data && !_.isEmpty(data)) {
                //avoid duplicate authorization request.
                if (PUBLIC_KEY_FIELD in data) {
                    return value;
                }
                return post(url, data, options);
            }
            return post(url, {}, _.assign({'needEncrypt': false}, options));
        });
    },

    'getState': function () {
        return state;
    },

    'isAuthorized': function () {
        return isAuthorized;
    }
});

//initialize
httpconnection.on('ready', function () {
    state = State.CONNECTING;
});
httpconnection.on('connect', function () {
    state = State.CONNECTED;
});
httpconnection.on('close', function () {
    state = State.INITIALIZED;
});
state = State.INITIALIZED;

//private functions
function post(url, data, options) {
    console.group('http post -', url);
    return session.write(data, options).then(function (value) {
        return http.post(url, value);
    }).then(function (value) {
        return session.read(value, options);
    }).then(function (data) {
        console.groupEnd();
        return data;
    });
}

function get(url, options) {
    console.group('http get -', url);
    return http.get(url).then(function (value) {
        return session.read(value, options);
    }).then(function (data) {
        console.groupEnd();
        return data;
    });
}

function authorize() {
    if (!authorizePromise) {
        var packet = _({})
            .set(UUID_FILED, userconfig.getUuid())
            .set(PUBLIC_KEY_FIELD, keyExchange.getPublicKey())
            .value();
        var options = _.assign({}, DEFAULT_CONFIG, {'needDecompress': false});

        authorizePromise = post(DEFAULT_ROOT + "auth/c", packet, options)
            .then(function (value) {
                var encryptKey = keyExchange.getEncryptKey(_.get(value, PUBLIC_KEY_FIELD));
                _.set(DEFAULT_CONFIG, 'encryptKey', encryptKey);
                userconfig.setUuid(_.get(value, UUID_FILED));
                isAuthorized = true;
                return value;
            });
    }
    return authorizePromise;
}
