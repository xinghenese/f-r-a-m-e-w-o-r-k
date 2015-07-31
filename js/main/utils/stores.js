/**
 * Created by kevin on 7/20/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var Promise = require('./promise');

// private fields
var cachedListeners = {};

// exports
module.exports = {
    observe: observeStore,
    unobserve: unobserveStore
};

function observeStore(store, predicate) {
    var performCheck;

    return Promise.create(function (resolve) {
        performCheck = function () {
            if (predicate.call(null, store)) {
                resolve();
            }
        };

        cacheListener(store, predicate, performCheck);
        store.addChangeListener(performCheck);
        performCheck();
    }).finally(function () {
        store.removeChangeListener(performCheck);
        unobserveStore(store, predicate);
    });
}

function unobserveStore(store, preditcate) {
    var cachedStore = cachedListeners[store];
    var item;

    if (!cachedStore) {
        return;
    }

    item = _.find(cachedStore, {predicate: preditcate});
    if (item) {
        _.forEach(item.listeners, function(listener) {
            store.removeChangeListener(listener);
        });
        cachedStore.splice(_.indexOf(cachedStore, item), 1);
    }

    if (_.isEmpty(cachedStore)) {
        delete cachedListeners[store];
    }
}

function cacheListener(store, predicate, listener) {
    var cachedStore = cachedListeners[store];
    var item;

    if (!cachedStore) {
        cachedStore = cachedListeners[store] = [];
    }

    item = _.find(cachedStore, {predicate: predicate});
    if (!item) {
        cachedStore.push({predicate: predicate, listeners: [listener]});
    } else {
        item.listeners.push(listener);
    }
}
