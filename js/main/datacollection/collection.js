/**
 * Created by Administrator on 2015/9/9.
 */
'use strict';

var _ = require('lodash');
var origin = require('../net/base/origin');
var Strings = require('../utils/strings');
var model = require('../datamodel/model');

module.exports = origin.extend({
    mixins: [],
    model: null,

    _entities: {},

    getSize: function () {
        return _.size(this._entities);
    },
    getItem: function (id) {
        return _.get(this._entities, id);
    },
    getItems: function (ids) {
        return _.filter(ids, _.bind(_.has, _, this._entities));
    },
    removeItem: function (id) {
        delete this._entities[id];
    },
    removeItems: function (ids) {
        _.forEach(ids, this.removeItem, this);
    },
    init: function (data) {
        checkModel(this);

        var item = this.model.create(data);
        var indexedKey = this.model.index;
        var entities = this._entities;

        if (indexedKey) {
            var itemKey = _.get(item, indexedKey);
            if (_.has(entities, itemKey)) {
                console.warn(Strings.template('a new item with same key {key} may replace the old one', itemKey));
            }
            _.set(entities, itemKey, item);
        } else {
            _.set(entities, _.size(entities), item);
        }

        return item;
    },
    extend: function (adapteds, finals) {
        var subType = origin.extend.call(this, adapteds, finals);
        checkModel(subType);

        if (subType.hasOwnProperty('mixins')) {
            // inherit and merge mixins
            subType.mixins = _.union(this.mixins, subType.mixins);
        }
        subType._entities = {};

        return subType;
    }
});

function checkModel(collection) {
    if (!model.isPrototypeOf(collection.model)) {
        throw new Error(Strings.template('invalid model of {collection}', collection));
    }
}
