/**
 * Created by Administrator on 2015/5/24.
 */

//dependencies
var _ = require('lodash');

//private fileds
var DEFAULT_CONSTRUCTOR = new Function();

//core module to export
module.exports = {
  /**
   * Creates a new object that inherits from this object.
   * @param adapter {Object}
   * @param finals {Object|Array}
   * @return {Object} The new object.
   * @example
   *     var MyType = origin.extend({
   *         field: 'value',
   *         method: function () {
   *         }
   *     });
   */
  extend: function(adapter, finals){
    var supertype = DEFAULT_CONSTRUCTOR.prototype = this;
    var subtype = new DEFAULT_CONSTRUCTOR();

    // Augment
    adapter = _.toPlainObject(adapter);
    if(_.isPlainObject(finals)){
      finals = _.keys(finals);
      adapter = _.assign(adapter, finals);
    }
    //Important to have mixIn and setFinals invoked in such order.
    subtype._mixIn(_.omit(adapter, this._finals));
    finals = subtype._finals = _.union(this._finals, finals);
    subtype._adapts = _.difference(_.keys(adapter), finals);

    // Create default initializer
    if (!subtype.hasOwnProperty('init')) {
      subtype.init = function () {
        return subtype.$super.init.apply(this, arguments);
      };
    }

    // Initializer's prototype is the subtype object
    subtype.init.prototype = subtype;

    // Reference supertype
    subtype.$super = supertype;

    return subtype;
  },

  /**
   * Extends this object and runs the init method.
   * Arguments to create() will be passed to init().
   * @return {Object} The new object.
   * @example
   *     var instance = MyType.create();
   */
  create: function(overrides){
    var initials = _.toArray(arguments);
    if(_.isPlainObject(overrides)){
      overrides = _.pick(overrides, this._adapts);
      if(!_.isEmpty(overrides)){
        initials = initials.slice(1);
      }
    }else{
      overrides = {};
    }

    var instance = this.extend(overrides, null);
    //modify $super reference
    instance.$super = this.$super;

    var ret = instance.init.apply(instance, initials);
    if(this.isPrototypeOf(ret)){
      return ret;
    }

    return instance;
  },

  init: function(){

  },

  _mixIn: function(properties){
    var self = this;
    _.forOwn(properties, function(property, propertyname){
        self[propertyname] = property;
    });

    // IE won't copy toString using the loop above
    if (properties.hasOwnProperty('toString')) {
      self.toString = properties.toString;
    }
  },

  /**
   * store names of methods which would not be overriden by subtypes.
   */
  _finals: []

};