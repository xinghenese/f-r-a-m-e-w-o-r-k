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
    getDefaultProps: function () {
        return {
            caseSensitive: true
        }
    },
    componentDidUpdate: function(preProps) {
        if (!_.isEqual(preProps.datasource, this.props.datasource)) {
            this._doSearch();
        }
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
        var transformString = this.props.caseSensitive
            ? function (str) { return String(str); }
            : function (str) { return String(str).toLowerCase(); };
        var searchText = transformString(this.getSearchText());

        _.forEach(fields, function(field) {
            result[field] = _.reduce(datasource, function(memo, data) {
                if (data[field] && transformString(data[field]).indexOf(searchText) > -1) {
                    memo.push(data);
                }
                return memo;
            }, []);
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
        var others = _.omit(this.props, ['onChange', 'onKeyDown', 'value']);
        return (
            <input
                type="search"
                onChange={this._doSearch}
                onKeyDown={this._onKeyDown}
                ref="searchInput"
                {...others}
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
    var target = event && event.target || React.findDOMNode(search.refs.searchInput);
    var searchText = String(target.value || '').toLowerCase();

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
