/**
 * Created by Administrator on 2015/7/9.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var makeStyle = require('../../style/styles').makeStyle;
var commonStyle = require('../../style/common');
var emitter = require('../../utils/eventemitter');

//private fields


//core module to export
var Search = React.createClass({
    propTypes: {
        datasource: React.PropTypes.array,
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

//module initialization
//var hierarchy = (
//    <Store>
//        <DataHolder handler={BottomSwitcher} control={super.data.switch}>
//            <DataHolder handler={TopSearchBar} control={super.data.search}>
//                <DataHolder handler={LeftListSwitcher} control={super.data.switch}>
//                    <DataHolder handler={RightList} />
//                </DataHolder>
//            </DataHolder>
//        </DataHolder>
//    </Store>
//);

//private functions
function startSearch(search, event) {
    var searchText = event.target.value;
    var searchFunction = search.props.searchFunction || function(data) {
        return _.some(data, function(value, key) {
            return key !== 'time' && ('' + value).indexOf(searchText) > -1;
        })
    };

    if (search.props.datasource) {
        return _.filter(search.props.datasource, searchFunction);
    }
    return null;
//    return function(datasource) {
//        return _.filter(datasource, searchFunction);
//    };
}

function onchange(search) {
    return function(event) {
        emitter.emit(
            search.constructor.displayName.toLowerCase(),
            startSearch(search, event)
        );
    }
}