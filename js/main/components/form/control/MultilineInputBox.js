/**
 * Created by Administrator on 2015/7/5.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var commonStyle = require('../../../style/common');
var theme = require('../../../style/default');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;

//private fields
//@link: <a href="http://www.textfixer.com/tutorials/browser-scrollbar-width"></a>
var SCROLLBAR_WIDTH = 17;
var LENTH_REG = /^(\d)+px$/;

var prefix = 'textarea-';
var index = 0;

//core module to export
var MultilineInputBox = React.createClass({
    _generateChildren: function() {
        return React.Children.map(this.props.children, function(child, key) {
            return React.cloneElement(child, {
                id: 'key-' + key
            });
        });
    },
    componentWillMount: function() {
        this._seq = prefix + (index++);
    },
    render: function() {
        var props = this.props;
        var style = props.style || {};
        var visibleWidth = _.find([props.width, style.width, theme.width], function(width) {
            return LENTH_REG.test(width);
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
                  onKeyDown={submit}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                  ref={this._seq}
                  style={makeStyle(commonStyle.textarea, theme.textarea, style, textAreaWidthStyle)}
                  ></textarea>
                {this._generateChildren()}
            </div>
        )
    }
});

module.exports = MultilineInputBox;

//private functions
function onInputBlur(event) {
//  setStyle(event.target.style, theme.textarea.blur);
}

function onInputFocus(event) {
//  setStyle(event.target.style, theme.textarea.focus);
}

function submit(event) {
    if (event.keyCode == 13 && event.ctrlKey) {
    }
}

function onChange(box) {
    return function(event) {
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