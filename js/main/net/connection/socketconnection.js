/**
 * Created by Administrator on 2015/6/2.
 */

//dependencies
var _ = require('lodash');
var promise = require('../../utils/promise');
var State = require('./connectionstate');
var connection = require('./connection');
var iosession = require('./iosession');
var socket = require('./socket');
var keyExchange = require('../crypto/factory').createKeyExchange();
var session = require('./socketsession');
var repeat = require('../../utils/repeat');
var authentication = require('./authentication');
var objects = require('../../utils/objects');
var UserConfig = require('../userconfig/userconfig');
var ConnectionType = require('./connectiontype');
var MessageConstants = require('../../constants/messageconstants');
var SocketRequestResponseTagMap = require('./SocketRequestResponseTagMap');

//private const fields
var PUBLIC_KEY_FIELD = "pbk";
var HANDSHAKE_TAG = "HSK";
var AUTH_TAG = "AUTH";
var PING_TAG = "P";
var SOCKET_HOSTS = [];
var DEFAULT_CONFIG = {
    'needEncrypt': true,
    'needDecrypt': true,
    'needCompress': false,
    'needDecompress': false,
    'needEncode': false,
    'needDecode': false,
    'needToken': false,
    'needWrap': false,
    'needUnwrap': true,
    'urlRoot': "",
    'encryptKey': "",
    'connectionType': ConnectionType.SOCKET
};

//private fields.
var tokenPromise = null;
var handshakePromise = null;
var authorizePromise = null;
var state = State.INITIALIZING;
var isAuthorized = false;

//core module to export
var socketconnection = module.exports = connection.extend({
    /**
     * post the packet to server and then wait for the response.
     * @param packet {Object|String}
     * @returns {Q.Promise}
     */
    request: function(packet) {
        packet = packetFormalize(packet);

        if (!packet.data && HANDSHAKE_TAG !== packet.tag) {
            return authorize().repeat(get(packet.tag));
        }
        return authorize().then(function(value) {
            //avoid duplicate handshake authorization request.
            if (HANDSHAKE_TAG == packet.tag || AUTH_TAG == packet.tag) {
                return value;
            }
            if (packet.data) {
                return post(packet);
            }
        });
    },
    /**
     * monitor the incoming packet data with specified tag pushed by server
     * @param tag {String}
     * @returns {Q.Promise}
     */
    monitor: function (tag) {
        if (!tag) {
            throw new Error('invalid tag');
        }
        return get(String(tag));
    },
    ping: ping,
    getState: function() {
        return state;
    },
    isAuthorized: function() {
        return isAuthorized;
    }
});

//initialize
socketconnection.on('ready', function() {
    state = State.CONNECTING;
}).done();
socketconnection.on('connect', function () {
    state = State.CONNECTED;
    socketconnection.on('message', onMessageReceived).done();
}).done();
state = State.INITIALIZED;

//private functions
//just listen to data reception with tag.
function get(tag) {
    return socketconnection.on(tag);
}

function post(packet) {
    var tag = packet.tag;
    var data = packet.data;

    if (session.has(tag)) {
        return promise.create(session.fetch(tag));
    }

    //process and write data to session and then send via socket.
    session.write(prepareRequestPacket(tag, data), _.assign({}, DEFAULT_CONFIG)).then(function(value) {
        return socket.send(value);
    });

    if ("responseTag" in packet && "predicate" in packet) {
        return socketconnection.conditionalOnce(packet.responseTag, packet.predicate,
            MessageConstants.MESSAGE_CONFIRM_TIMEOUT);
    } else if ("responseTag" in packet) {
        return socketconnection.once(packet.responseTag);
    } else {
        return socketconnection.once(tag);
    }
}

function packetFormalize(packet) {
    var tag;
    var data;

    if (!packet || _.isEmpty(packet)) {
        throw new Error("empty packet to be sent via socket");
    }
    if (_.isPlainObject(packet)) {
        tag = String(packet.tag || _.keys(packet)[0]);
        data = packet.data || _.get(packet, tag);

        if (!tag) {
            throw new Error('invalid tag');
        }

        var result = {
            tag: tag.toUpperCase()
        };
        if (data && !_.isEmpty(data)) {
            result["data"] = data;
        }
        objects.copyPropsExcept(packet, result, ["tag", "data"]);
        return result;
    }

    return {
        tag: String(tag || packet).toUpperCase(),
        data: null
    }
}

function prepareRequestPacket(tag, data) {
    if (isAuthorized) {
        _.set(data, "msuid", UserConfig.getUid());
        _.set(data, "msqid", authentication.nextEncodedSequence());
        _.set(data, "ver", UserConfig.getVersion());
    }
    return _.set({}, tag, data);
}

function onMessageReceived(msg) {
    return session.read(msg, _.assign({}, DEFAULT_CONFIG)).then(function(value) {
        console.log("received: ", value);
        var tag = value.tag;
        var data = value.data;

        //check whether the message is pushed by server or pulled from server.
        if (tag && !_.isEmpty(socketconnection.listeners(tag))) {
            socketconnection.emit(tag, data);
        } else {
            //if the message pushed by server does not have to notify immediately,
            //then cache it into the session for later use.
            if (shouldNotify(tag)) {
                notifyImmediately(tag, data);
            } else {
                session.cache(tag, data);
            }
        }
    });
}

function authorize() {
    if (!authorizePromise) {
        authorizePromise = handshake().then(function() {
            return post({
                tag: AUTH_TAG,
                data: UserConfig.socksubset("msuid", "ver", "tk", "devuuid", "dev"),
                responseTag: SocketRequestResponseTagMap.getResponseTag(AUTH_TAG)
            });
        }).then(function(data) {
            if (!authentication.validateSequence(_.get(data, 'msqsid'))) {
                throw new Error("sequence invalid with ", _.get(data, 'msqsid'));
            }
            isAuthorized = true;
            return data;
        });
    }

    return authorizePromise;
}

function handshake() {
    if (!handshakePromise) {
        handshakePromise = post({
            tag: HANDSHAKE_TAG,
            data: _.set(UserConfig.socksubset("ver"), PUBLIC_KEY_FIELD
                , keyExchange.getPublicKey())
        }).then(function(data) {
            _.set(DEFAULT_CONFIG, 'encryptKey'
                , keyExchange.getEncryptKey(_.get(data, PUBLIC_KEY_FIELD)));
            return data;
        });
    }

    return handshakePromise;
}

function ping() {
    return authorize().then(function() {
        return post({
            tag: PING_TAG,
            data: _.set(UserConfig.socksubset('msuid', 'ver'), 'msqid'
                , authentication.nextEncodedSequence()),
            responseTag: SocketRequestResponseTagMap.getResponseTag(PING_TAG)
        })
    }).then(function(data) {
        return data;
    });
}

function shouldNotify(tag) {
    return Math.random() < 0.5;
}

function notifyImmediately(tag, data) {
    console.log('notifyImmediately: ', JSON.stringify({
        'tag': tag,
        'data': data
    }));
}
