/**
 * Created by Administrator on 2015/7/27.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;

//private fields
var suffix = '-option';

//core module to export
var ConversationUserSwitcher = React.createClass({
    propTypes: {
        options: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ])
    },
    getInitialState: function() {
        var options = this.props.options;
        options = _.isArray(options) ? options : _.values(options);
        return {selectedIndex: options[0]};
    },
    _switch: function(event) {
        var switchedName = event.target.className.replace(suffix, '');
        this.setState({selectedIndex: switchedName});
        if (_.isFunction(this.props.onSwitch)) {
            this.props.onSwitch(switchedName);
        }
    },
    render: function() {
        if (!this.props.options || _.isEmpty(this.props.options)) {
            return null;
        }

        var items = _.map(this.props.options, function(value, key) {
            var currentStyle = style.footer.switcher[key].inactive;

            if (value === this.state.selectedIndex) {
                currentStyle = style.footer.switcher[key].active;
            }

            return (
                <li
                    key={key}
                    className={value + suffix}
                    onClick={this._switch}
                    style={makeStyle(style.footer.switcher.option, currentStyle)}
                />
            )
        }, this);

        return (
            <ul
                className="conversations-contacts-switcher"
                style={makeStyle(style.footer.switcher, this.props.style)}
            >
                {items}
            </ul>
        )
    }
});

module.exports = ConversationUserSwitcher;

//module initialization


//private functions