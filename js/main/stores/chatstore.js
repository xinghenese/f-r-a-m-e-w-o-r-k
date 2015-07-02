/**
 * Created by kevin on 6/30/15.
 */
'use strict';

// dependencies
var ActionTypes = require('../constants/constants').ActionTypes;
var AppDispatcher = require('../dispatchers/appdispatcher');
var EventEmitter = require('events').EventEmitter;
var HttpConnection = require('../net/connection/httpconnection');
var assign = require('object-assign');

// private fields
var ChatStore = assign({}, EventEmitter.prototype, {
    Events: {
    }
});

// exports
module.exports = ChatStore;

// module initialization
ChatStore.dispatchToken = AppDispatcher.register(function(action) {
    switch (action.type) {
        case ActionTypes.GET_CHAT_LIST:
            console.log("22222222222");
            _handleGetChatListRequest(action);
            break;
    }
});

// private functions
function _handleGetChatListRequest(action) {
    HttpConnection.request({
        url: "cht/gcl",
        data: {
            tp: action.listType
        }
    }).then(function(response) {
        console.log(response);
    }, function(error) {
        console.log(error);
    });
}