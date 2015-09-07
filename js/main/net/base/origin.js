/**
 * Created by Administrator on 2015/5/24.
 */

var _ = require('lodash');

var DEFAULT_CONSTRUCTOR = new Function();

module.exports = {
    /**
     * Creates a new object that inherits from this object.
     * @param adapteds {Object}
     * @param finals {Array|Object}
     * @return {Object} The new object.
     * @example
     *     var MyType = origin.extend({
     *         field: 'value',
     *         method: function () {
     *         }
     *     });
     */
    extend: function (adapteds, finals) {
        var superType = DEFAULT_CONSTRUCTOR.prototype = this;
        var subType = new DEFAULT_CONSTRUCTOR();

        // Augment
        var implementedMemberMap = _.toPlainObject(adapteds);
        var implementedMembers = _.union(this._implementedMembers, _.keys(implementedMemberMap));
        var adaptedMemberMap;
        var finalMembers;

        if (_.isObject(finals) && !_.isArray(finals)) {
            _.assign(implementedMemberMap, finals);
            finalMembers = _.keys(finals);
        } else if (finals) {
            finalMembers = _.isArray(finals) ? finals : [finals];
        }
        adaptedMemberMap = _.omit(implementedMemberMap, this._finalMembers);

        _.assign(subType, adaptedMemberMap, {
            _finalMembers: _.union(this._finalMembers, _.intersection(implementedMembers, finalMembers)),
            _implementedMembers: _.union(this._implementedMembers, implementedMembers)
        });

        // Create default initializer
        if (!subType.hasOwnProperty('init')) {
            subType.init = function () {
                return subType.$super.init.apply(this, arguments);
            };
        }

        // Initializer's prototype is the subType object
        subType.init.prototype = subType;

        // Reference superType
        subType.$super = superType;

        return subType;
    },

    /**
     * Extends this object and runs the init method.
     * Arguments to create() will be passed to init().
     * @return {Object} The new object.
     * @example
     *     var instance = MyType.create();
     */
    create: function () {
        var instance = this.extend(null, null);
        var ret = instance.init.apply(instance, _.toArray(arguments));

        return this.isPrototypeOf(ret) ? ret : instance;
    },

    init: function () {

    },

    /**
     * store names of methods which would not be overriden by subTypes.
     */
    _finalMembers: [],

    _implementedMembers: []

};
