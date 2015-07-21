/**
 * Created by Administrator on 2015/7/9.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var helper = require('../base/helper/helper');
var eventEmitter = require('../../utils/eventemitter');
var createReferableClass = require('../base/creator/createReferableClass');

//private fields


//core module to export
module.exports = createReferableClass({
    displayName: 'DataHolder',
    _updateStateAndNotify: function(data) {
        var emitter = this.props.emitter;
        var event = this.props.updateEvent;

        if (event && eventEmitter.isPrototypeOf(emitter)) {
            emitter.emit(event, data);
        }
    },
    componentWillMount: function() {
        var self = this;
        var emitter = this.props.emitter;
        var event = this.props.superUpdateEvent;

        if (event && eventEmitter.isPrototypeOf(emitter)) {
            emitter.on(event, function(data) {
                self.getTopOwnedNode().setState({data: data});
            });
        }
    },
    render: function() {
        if (!this.props.handler) {
            return null;
        }

        var className = this.props.className || getTagName(this.props.handler).toLowerCase();
        var props = _(this.props)
            .omit(['domPath', 'handler'])
//            .pick(['emitter', 'updateEvent', 'superUpdateEvent', 'id', 'style', 'rawStyle'])
            .assign(this.props.props, {
                className: className,
                datasource: this.props.data || this.props.store
            })
            .value()
        ;

        var hooks = this.props.updateHook;
        hooks = hooks && (_.isArray(hooks) ? hooks : [hooks]);
        if (hooks && !_.isEmpty(hooks)) {
            _.forEach(hooks, function(hook) {
                _.set(props, hook, this._updateStateAndNotify);
            }, this);
        }

        if (React.isValidElement(this.props.handler)) {
            return React.cloneElement(this.props.handler, props);
        }
        return React.createElement(
            this.props.handler,
            props
        );
    }
});

//module initialization


//private functions
function getTagName(handler) {
    if (_.isString(handler)) {
        return handler;
    }
    if (_.isFunction(handler)) {
        return handler.displayName || handler.tagName || 'component';
    }
    return helper.getNodeName(handler);
}