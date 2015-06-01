/**
 * Created by Administrator on 2015/5/24.
 */
define(function(require, exports, module){

  //dependencies
  var _ = require('lodash');

  //core module to export
  module.exports = (function(){

    var Constructor = new Function();

    return {
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
        Constructor.prototype = this;
        var subtype = new Constructor();

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
            subtype.$super.init.apply(this, arguments);
          };
        }

        // Initializer's prototype is the subtype object
        subtype.init.prototype = subtype;

        // Reference supertype
        subtype.$super = this;

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
        instance.init.apply(instance, initials);

        return instance;
      },

      init: function(){

      },

      _mixIn: function(properties){
        var self = this;
        _.forOwn(properties, function(property, propertyname){
//          if(_.startsWith(propertyname, '_')){
//            self._privates[_.trimLeft(propertyname, '_')] = property;
//          }else{
            self[propertyname] = property;
//          }
        });

        // IE won't copy toString using the loop above
        if (properties.hasOwnProperty('toString')) {
          self.toString = properties.toString;
        }
      },

      /**
       * store names of methods which would not be overriden by subtypes.
       */
      _finals: [],

      /**
       * store private properties.
       */
      _privates: {}

    }

  })();

});