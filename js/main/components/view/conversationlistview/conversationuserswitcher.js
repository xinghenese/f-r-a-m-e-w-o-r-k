/**
 * Created by Administrator on 2015/7/27.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var classNames = require('classnames');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;
var globalEmitter = require('../../../events/globalemitter');
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
        return {selectedKey: _.keys(this.props.data)[0] || -1};
    },
    getDefaultProps: function () {
        return {onSelect: defaultOnSelect};
    },
    renderItem: function (option, key, props) {
        option = String(option);
        return <button className={classNames(option, {active: this.checkItemSelected(key), unread: true})} data-option={option}/>;
    }
});

//module initialization


//private functions
function defaultOnSelect(event) {
    globalEmitter.emit(EventTypes.SWITCH_CONVERSATIONS_OR_CONTACTS, {
        option: event.currentTarget.getAttribute('data-option')
    });
}
