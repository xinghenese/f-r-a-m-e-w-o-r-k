/**
 * Created by kevin on 7/20/15.
 */
'use strict';

// dependencies
var Promise = require('./promise');

// exports
function observeStore(store, predicate) {
    var performCheck;

    return Promise.create(function (resolve) {
        performCheck = function () {
            if (predicate.call(null, store)) {
                console.log("predicate true");
                resolve();
            }
        };

        store.addChangeListener(performCheck);
        performCheck();
    }).finally(function () {
        store.removeChangeListener(performCheck);
    });
}

var store = {
    _callback: null,
    _done: false,
    addChangeListener: function (callback) {
        this._callback = callback;
    },
    emitChange: function () {
        this._callback();
    },
    isDone: function () {
        return this._done;
    },
    removeChangeListener: function (callback) {
        this._callback = null;
    },
    setDone: function () {
        this._done = true;
        this.emitChange();
    }
};

observeStore(store, function () {
    return store.isDone();
}).then(function () {
    console.log("done");
});

store.setDone();
