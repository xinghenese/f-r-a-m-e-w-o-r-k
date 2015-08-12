/**
 * Created by Administrator on 2015/7/9.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var KeyCodes = require('../../constants/keycodes');
var makeStyle = require('../../style/styles').makeStyle;
var commonStyle = require('../../style/common');
var defaultStyle = require('../../style/default');
var emitter = require('../../utils/eventemitter.thenable');
var setStyle = require('../../style/styles').setStyle;

//core module to export
var Search = React.createClass({
    propTypes: {
        searchFunction: React.PropTypes.func
    },
    _doSearch: function(event) {
        if (_.isFunction(this.props.onSearch)) {
            this.props.onSearch(startSearch(this, event));
        }
    },
    _onKeyDown: function(event) {
        if (_.isFunction(this.props.onKeyDown)) {
            this.props.onKeyDown(event);
        }
    },
    clear: function() {
        React.findDOMNode(this.refs.searchInput).value = "";
        this._doSearch();
    },
    defaultSearchFunc: function(datasource, fields) {
        var result = {};
        var searchText = this.getSearchText().toLowerCase();

        _.forEach(fields, function(field) {
            var subResult = _.reduce(datasource, function(memo, data) {
                if (data[field] && data[field].toString().toLowerCase().indexOf(searchText) > -1) {
                    memo.push(data);
                }
                return memo;
            }, []);
            if (subResult && !_.isEmpty(subResult)) {
                result[field] = subResult;
            }
        });

        return result;
    },
    focus: function() {
        React.findDOMNode(this.refs.searchInput).focus();
    },
    getSearchText: function() {
        return React.findDOMNode(this.refs.searchInput).value || "";
    },
    render: function() {
        return (
            <input
                type="text"
                id={this.props.id}
                className={this.props.className}
                placeholder={this.props.defaultValue}
                onChange={this._doSearch}
                onBlur={onBlur}
                onFocus={onFocus}
                onKeyDown={this._onKeyDown}
                style={makeStyle(commonStyle.input, this.props.style)}
                ref="searchInput"
                />
        )
    }
});

module.exports = Search;

//private functions
function startSearch(search, event) {
    var result = {};
    var datasource = search.props.datasource;
    var searchFunction = search.props.searchFunction;
    var fields = search.props.fields;
    var searchText = (event && event.target && event.target.value || '').toLowerCase();

    if (!datasource || (!_.isFunction(searchFunction) && !fields) || !searchText) {
        return null;
    }

    if (_.isFunction(searchFunction)) {
        result = searchFunction.call(search, datasource, searchText);
    } else if (fields) {
        if (!_.isArray(fields)) {
            fields = [fields];
        }
        result = search.defaultSearchFunc(datasource, fields);
    }

    return result;
}

function onBlur(event) {
    setStyle(event.target.style, defaultStyle.search.blur);
}

function onFocus(event) {
    setStyle(event.target.style, defaultStyle.search.focus);
}
