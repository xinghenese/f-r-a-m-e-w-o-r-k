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
    updateStateAndNotify: function(data) {
        if (this.props.updateEvent && eventEmitter.isPrototypeOf(this.props.emitter)) {
            this.props.emitter.emit(this.props.updateEvent, data);
        }
//        this.props.emitter.emit(this.getSeq(), data);
    },
    componentWillMount: function() {
        console.log(this.constructor.displayName + '#props: ', this.props);
        if (this.props.superUpdateEvent && eventEmitter.isPrototypeOf(this.props.emitter)) {
            var self = this;
            this.props.emitter.on(this.props.superUpdateEvent, function(data) {
                self.getTopOwnedNode().setState({data: data});
            });
        }
    },
    render: function() {
        if (!this.props.handler) {
            return null;
        }
        console.log('seq: ', this.getSeq());
//        var children = React.Children.map(this.props.children, function(child) {
//            return React.cloneElement(
//                child,
//                {event: this.getSeq(), emitter: this.props.emitter}
//            )
//        }, this);

//        var props = _.assign({}, this.props, {event: this.getSeq(), emitter: this.props.emitter});

        var props = _.omit(this.props, ['domPath', 'handler']);

        if (React.isValidElement(this.props.handler)) {
            console.log('DataHolder#render#isElement');
            return React.cloneElement(this.props.handler, props);
        }
        console.log('DataHolder#render#isClass');
        return React.createElement(
            this.props.handler,
            props
        );
    }
});

//module initialization


//private functions
