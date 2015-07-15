/**
 * Created by Administrator on 2015/7/9.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var helper = require('../base/helper/helper');

//private fields


//core module to export
module.exports = React.createClass({
    displayName: 'DataHolder',
    updateStateAndNotify: function(data) {
//        this.props.emitter.emit(this.getSeq(), data);
    },
    componentWillMount: function() {
//        var self = this;
//        this.props.emitter.on(this.props.event, function(data) {
//            self.getTopOwnedNode().setState({data: data});
//        });
    },
    render: function() {
        if (!this.props.handler) {
            return null;
        }
        var children = React.Children.map(this.props.children, function(child) {
            return React.cloneElement(
                child,
                {event: 'this.getSeq()', emitter: this.props.emitter}
            )
        }, this);

        return React.createElement(
            this.props.handler,
            this.props,
            children
        );
    }
});

//module initialization


//private functions
