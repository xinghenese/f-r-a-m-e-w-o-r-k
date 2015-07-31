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
                resolve();
            }
        };

        store.removeAllChangeListener();
        store.addChangeListener(performCheck);
        performCheck();
    }).finally(function () {
        store.removeChangeListener(performCheck);
    });
}

module.exports = {
    observe: observeStore
};
