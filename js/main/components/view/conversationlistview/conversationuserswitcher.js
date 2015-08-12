/**
 * Created by Administrator on 2015/7/27.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;
var emitter = require('../../../utils/eventemitter');
var EventTypes = require('../../../constants/eventtypes');

var createGenerator = require('../../base/creator/createReactClassGenerator');
var listableMixin = require('../../base/specs/list/listable');
var selectableMixin = require('../../base/specs/list/selectable');

//private fields
var suffix = '-option';
var createListClass = createGenerator({
    mixins: [selectableMixin, listableMixin]
});

//core module to export
module.exports = createListClass({
    displayName: 'ConversationUserSwitcher',
    getInitialState: function () {
        return {
            selectedKey: _.keys(this.props.data)[0] || -1
        }
    },
    getDefaultProps: function () {
        return {
            className: 'conversations-contacts-switcher',
            onSelect: defaultOnSelect,
            style: style.footer.switcher
        }
    },
    renderItem: function (option, props, key) {
        option = String(option);
        var currentStyle = style.footer.switcher[option].inactive;

        if (key == this.state.selectedKey) {
            currentStyle = style.footer.switcher[option].active;
        }
        return (
            <li
                key={key}
                data-option={option}
                style={makeStyle(style.footer.switcher.option, currentStyle)}
                />
        )
    }
});

//module initialization


//private functions
function defaultOnSelect(event) {
    emitter.emit(EventTypes.SWITCH_CONVERSATIONS_OR_CONTACTS, {
        option: event.currentTarget.getAttribute('data-option')
    });
}
