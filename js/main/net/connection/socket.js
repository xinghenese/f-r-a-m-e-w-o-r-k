/**
 * Created by Administrator on 2015/6/3.
 */

//dependencies
var _ = require('lodash');
var promise = require('../../utils/promise');
var serverInfoEmitter = require('../emitters/serverInfos');

//private fields
var socket = null;
var connectPromise = null;
var initPromise = null;
var serverInfos = _.shuffle(['192.168.1.66', '192.168.1.67', '192.168.1.68']);
var serverPort = 443;
var serverInfoIndex = 0;

module.exports = {
    /**
     * @param data {*}
     * @return Q.Promise
     */
    'send': send
};

//private fields
function send(data) {
    var pro = init()
        .then(function (serverInfo) {
            var host, port;
            if (_.isPlainObject(serverInfo)) {
                host = serverInfo.host || serverInfo.ip;
                port = serverInfo.port || serverPort;
            } else {
                host = "" + serverInfo;
                port = serverPort;
            }
            return connect(host, port);
        })
        .then(function () {
            socket.send(data);
        }, function () {
            //handle reconnect
            return reset().then(function () {
                return send(data);
            });
        }).catch(function (error) {
            console.error(error);
        });
    return pro;
}

function init() {
    if (!initPromise) {
        if (serverInfos && serverInfos[serverInfoIndex]) {
            initPromise = promise.create(serverInfos[serverInfoIndex++]);
        } else {
            initPromise = serverInfoEmitter.once(serverInfoEmitter.events.serverInfos)
                .then(function (infos) {
                    console.log(infos);
                    return _.shuffle(infos)[serverInfoIndex];
                })
            ;
        }
    }
    return initPromise;
}

function reset() {
    return promise.create(function (resolve, reject) {
        initPromise = null;
        connectPromise = null;
        resolve('reset');
    });
}

function connect(host, port, path, protocol) {
    if (!(socket && connectPromise)) {
        connectPromise = promise.create(function (resolve, reject) {
            var url;

            if (!host) {
                reject("invalid host to connect via socket");
                return;
            }

            //shutdown and clear socket
            if (socket) {
                console.log('socket to be closed');
                socket.close();
            }
            //url assembly
            port = port || '80';
            path = path || '';
            protocol = protocol || 'ws';
            url = protocol + '://' + host + ':' + port + '/' + path;
            socket = new WebSocket(url);

            getConnection().emit('ready');

            //set handler
            socket.onopen = function (event) {
//        console.log(event);
                resolve(event);
                getConnection().emit('connect', event);
            };
            socket.onclose = function (event) {
                console.log(event);
            };
            socket.onerror = function (event) {
                console.log(event);
                reject(event);
            };
            socket.onmessage = function (event) {
//        console.log(event);
                getConnection().emit('message', event.data);
            };
        });
    }
    return connectPromise;
}

function getConnection() {
    var connection = require('./socketconnection');
    if (!connection) {
        throw new Error('socketconnection not initialized yet');
    }
    return connection;
}
