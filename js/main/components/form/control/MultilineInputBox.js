/**
 * Created by Administrator on 2015/7/5.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var EventTypes = require('../../../constants/eventtypes');
var commonStyle = require('../../../style/common');
var emitter = require('../../../utils/eventemitter');
var theme = require('../../../style/default');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;
var KeyCodes = require('../../../constants/keycodes');

//private fields
//@link: <a href="http://www.textfixer.com/tutorials/browser-scrollbar-width"></a>
var SCROLLBAR_WIDTH = 17;
var LENGTH_REG = /^(\d)+px$/;

var prefix = 'textarea-';
var index = 0;

//core module to export
var MultilineInputBox = React.createClass({
    _generateChildren: function () {
        return React.Children.map(this.props.children, function (child, key) {
            return React.cloneElement(child, {
                id: 'key-' + key
            });
        });
    },
    _focusInput: function() {
        var self = this;
        _.defer(function() {
            React.findDOMNode(self.refs[self._seq]).focus();
        });
    },
    _handleSubmit: function (event) {
        this.props.onSubmit(event);
    },
    _onKeyDown: function (event) {
        if (event.keyCode == KeyCodes.ENTER && !event.ctrlKey) {
            event.preventDefault();
            event.stopPropagation();
            this._handleSubmit(event);
        }
    },
    componentWillMount: function () {
        this._seq = prefix + (index++);
    },
    componentDidMount: function() {
        emitter.on(EventTypes.FOCUS_MESSAGE_INPUT, this._focusInput);
    },
    componentWillUnmount: function() {
        emitter.removeListener(EventTypes.FOCUS_MESSAGE_INPUT, this._focusInput);
    },
    render: function () {
        var props = this.props;
        var style = props.style || {};
        var visibleWidth = _.find([props.width, style.width, theme.width], function (width) {
            return LENGTH_REG.test(width);
        });
        var actualWidth = visibleWidth && (+visibleWidth.replace('px', '')) + SCROLLBAR_WIDTH + 'px';
        var wrapperWidthStyle = visibleWidth && {width: visibleWidth};
        var textAreaWidthStyle = actualWidth && {width: actualWidth};

        return (
            <div
                id="wrapper1"
                className={props.className}
                style={makeStyle(commonStyle.textarea.wrapper, theme.textarea.wrapper, wrapperWidthStyle)}
                >
                <textarea
                    id="text1"
                    placeholder={props.defaultValue}
                    rows={props.initialRows || 1}
                    onChange={onChange(this)}
                    onKeyDown={this._onKeyDown}
                    ref={this._seq}
                    style={makeStyle(commonStyle.textarea, theme.textarea, style, textAreaWidthStyle)}
                    >
                </textarea>
                {this._generateChildren()}
            </div>
        )
    }
});

module.exports = MultilineInputBox;

//private functions
function onChange(box) {
    return function (event) {
        var target = event.currentTarget;

        //notify the renderer to recalculate the scrollHeight prop.
        target.style.height = 0;
        target.style.height = target.scrollHeight + 'px';

        box.value = target.value;

        if (_.isFunction(box.props.onChange)) {
            box.props.onChange(event);
        }
    };
}
