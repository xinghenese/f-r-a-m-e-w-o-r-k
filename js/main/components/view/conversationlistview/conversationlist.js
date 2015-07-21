/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var ConversationListItem = require('./conversationlistitem');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;

//private fields
//var prefix = 'conversation-list-';
var index = 0;

//core module to export
var ConversationList = React.createClass({
    getInitialState: function() {
        return {selectedIndex: -1, data: this.props.datasource};
    },
    render: function() {
        var conversationListItem = null;
        var inlineStyle = this.props.style || {};

        if (this.props.data && !_.isEmpty(this.state.data)) {
            console.log('conversationList.data: ', this.state.data);

            conversationListItem = _.map(fetchLastMessages(this.state.data), function(data, key) {

                return (
                    <ConversationListItem
                        key={key}
                        time={data.time}
                        senderName={data.senderName}
                        senderAvatar={data.senderAvatar}
                        index={key}
                        onSelect={onselect(this)}
                        selected={this.state.selectedIndex == key}
                        style={inlineStyle.item}
                    >
                        {data.message}
                    </ConversationListItem>
                    );
            }, this);
        }
        return (
            <ul className="chat-message-list"
                style={makeStyle(inlineStyle)}
                >
                {conversationListItem}
            </ul>
        )
    }
});

module.exports = ConversationList;

//module initialization


//private functions
function onselect(list) {
    return function(event) {
        var index = event.currentTarget.id;
        list.setState({selectedIndex: index});
        console.log('list.state: ', index);
        console.log('data: ', _.get(list.state.data, index));
        list.props.onSelect(_.get(list.state.data, index));
    }
}

function fetchLastMessages(data) {
    return _.mapValues(data, function(value, key) {
        return _.isArray(value) ? _.last(value) : value;
    });
}