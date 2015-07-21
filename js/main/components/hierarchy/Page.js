/**
 * Created by Administrator on 2015/7/14.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var eventEmitter = require('../../utils/eventemitter');
var createGenerator = require('../base/creator/createReactClassGenerator');
var reconstructable = require('../base/specs/reconstructable');
//var modifiable = require('../base/specs/modifiable');
var namespaceEnable = require('../base/specs/namespaceEnable');
var stylizable = require('../base/specs/stylizable');

//private fields
var createReconstructableClass = createGenerator({
    mixins: [stylizable, namespaceEnable, reconstructable]
});

//core module to export
module.exports = createReconstructableClass({
    render: function() {
        var emitter = eventEmitter.create();
        var children = React.Children.map(this.props.children, function(child) {
            return React.cloneElement(child, {emitter: emitter});
        }, this);
        return <div {...this.props}>{children}</div>;
    }
});

//module initialization


//private functions