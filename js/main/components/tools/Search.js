/**
 * Created by Administrator on 2015/7/9.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var makeStyle = require('../../style/styles').makeStyle;
var commonStyle = require('../../style/common');
var emitter = require('../../utils/eventemitter.thenable');

//private fields


//core module to export
var Search = React.createClass({
    propTypes: {
        searchFunction: React.PropTypes.func
    },
    render: function() {
        return (
            <input
                type="text"
                id={this.props.id}
                className={this.props.className}
                placeholder={this.props.defaultValue}
                onChange={onchange(this)}
                style={makeStyle(commonStyle.input, this.props.style)}
            />
        )
    }
});

module.exports = Search;

//private functions
function startSearch(search, event) {
    var searchText = event.target.value;
    var searchFunction = search.props.searchFunction || function(datas, key) {
        return ('' + key).indexOf(searchText) > -1;
    };

    if (search.props.datasource) {
        console.log('datasource: ', search.props.datasource);

        return _.filter(search.props.datasource, searchFunction);
    }
    return null;
}

function onchange(search) {
    return function(event) {
        console.group('searched');
        var result = startSearch(search, event);
        console.log('result: ', result);
        console.groupEnd();
        search.props.onChange(result);
    }
}