/**
 * Created by Administrator on 2015/7/27.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var ConversationListItem = require('./conversationlistitem');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;
var emitter = require('../../../utils/eventemitter');

//private fields
var options = {
    conversation: 'conversation-option',
    contacts: 'contacts-option'
};

//core module to export
var ConversationUserSwitcher = React.createClass({
    propTypes: {

    },
    getInitialState: function() {
        return {selectedIndex: options.conversation};
    },
    _switch: function(event) {
        var switchedName = event.target.className;
        this.setState({selectedIndex: switchedName});
        if (_.isFunction(this.props.onSwitch)) {
            this.props.onSwitch(switchedName.replace('-option', ''));
        }
    },
    render: function() {
        var items = _.map(options, function(value, key) {
            var currentStyle = style.footer.switcher[key].inactive;

            if (value === this.state.selectedIndex) {
                currentStyle = style.footer.switcher[key].active;
            }

            return (
                <li
                    key={key}
                    className={value}
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
function onselect(list) {
    return function(event) {
        var index = event.currentTarget.id.replace(/\D/g, '');
        list.setState({selectedIndex: index});
        emitter.emit('switch', {
            id: index,
            type: _.get(list.props.data, index).type
        });
    };
}