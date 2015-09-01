/**
 * Created by Administrator on 2015/7/30.
 */
'use strict';

//dependencies
var _ = require('lodash');
var React = require('react');
var Search = require('./tools/Search');
var Lang = require('../locales/zh-cn');
var countries = require('../constants/countries');

var createGenerator = require('./base/creator/createReactClassGenerator');
var listableMixin = require('./base/specs/list/listable');
var selectableMixin = require('./base/specs/list/selectable');

//private fields
var createListClass = createGenerator({
    mixins: [selectableMixin, listableMixin]
});

var CountryList = createListClass({
    displayName: 'CountryList',
    renderItem: function (data, key, props) {
        return (
            <div className="item" data-name={data.name} data-code={data.code}>
                <span className="name">{data.name}</span>
                <span className="code">{data.code}</span>
            </div>
        )
    }
});

//core module to export
module.exports = React.createClass({
    displayName: 'CountryForm',
    getInitialState: function () {
        return {displayData: countries};
    },
    _onSelect: function (event) {
        var target = event.currentTarget;
        this.props.onCountryCodeSelected({
            countryName: target.getAttribute('data-name'),
            countryCode: target.getAttribute('data-code')
        });
    },
    _onSearch: function (data) {
        this.setState({displayData: data ? data.name : countries});
    },
    render: function () {
        return (
            <div className="sign-in">
                <div className="main step2">
                    <h1 className="title">{Lang.countryFormTitle}</h1>
                    <div className="form-group filter">
                        <Search
                            datasource={countries}
                            fields={'name'}
                            placeholder={Lang.countrySearchTips}
                            onSearch={this._onSearch}
                            />
                    </div>
                    <CountryList
                        className="form-group countries"
                        data={this.state.displayData}
                        onSelect={this._onSelect}
                        />
                </div>
            </div>
        )
    }
});

//module initialization


//private functions
