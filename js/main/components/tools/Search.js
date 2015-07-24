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
    componentWillMount: function() {
        onchange(this)();
    },
    componentWillReceiveProps: function(nextProps) {
        if (!_.isEqual(nextProps.datasource, this.props.datasource)) {
            onchange(this)();
        }
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
    var result = {};
    var datasource = search.props.datasource;
    var searchFunction = search.props.searchFunction;
    var fields = search.props.fields;
    var searchText = event && event.target && event.target.value || '';

    if (!datasource || (!_.isFunction(searchFunction) && !fields)) {
        return null;
    }

    if (_.isFunction(searchFunction)) {
        result = searchFunction.call(search, datasource);
    } else if (fields) {
        if (!_.isArray(fields)) {
            fields = [fields];
        }

        _.forEach(fields, function(field) {
            var subResult = _.reduce(datasource, function(memo, data, key) {
                if (data[field].indexOf(searchText) > -1) {
                    return _.set(memo, key, data);
                }
                return memo;
            }, {});
            if (subResult && !_.isEmpty(subResult)) {
                result[field] = subResult;
            }
        });
    }

    return result && !_.isEmpty(result) ? result : null;
}

function onchange(search) {
    return function(event) {
        var result = startSearch(search, event);
        if (result && _.isFunction(search.props.onSearch)) {
            search.props.onSearch(result);
        }
    }
}