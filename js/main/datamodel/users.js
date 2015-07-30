/**
 * Created by kevin on 7/5/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var User = require('./user');

// exports
var users = {
    _cursor: "",
    _users: [],
    addUser: function (user) {
        this._users.push(user);
    },
    getCursor: function (cursor) {
        return this._cursor;
    },
    getUser: function (userId) {
        _.find(this._users, function (user) {
            return user.getUserId() === userId;
        });
    },
    removeUser: function (userId) {
        _.remove(this._users, function (user) {
            return user.getUserId() === userId;
        });
    },
    setCursor: function (cursor) {
        this._cursor = cursor;
    },
    setUsers: function (arr) {
        this._users = arr;
    }
};

module.exports = users;
