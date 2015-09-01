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
    create: function(userInfo) {
        var newUser = new User(userInfo);
        this.addUser(newUser);
        return newUser;
    },
    addUser: function(user) {
        this._users.push(user);
    },
    getCursor: function() {
        return this._cursor;
    },
    getUser: function(userId) {
        var intUserId = parseInt(userId);
        return _.find(this._users, function (user) {
            return user.getUserId() === intUserId;
        });
    },
    getUsers: function() {
        return _.clone(this._users);
    },
    removeUser: function(userId) {
        var intUserId = parseInt(userId);
        _.remove(this._users, function (user) {
            return user.getUserId() === intUserId;
        });
    },
    setCursor: function(cursor) {
        this._cursor = cursor;
    },
    setUsers: function(arr) {
        this._users = arr;
    }
};

module.exports = users;
