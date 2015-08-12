/**
 * Created by Administrator on 2015/7/30.
 */
'use strict';

//dependencies
var _ = require('lodash');
var React = require('react');
var Search = require('./tools/Search');
var loginStyle = require('../style/login');
var makeStyle = require('../style/styles').makeStyle;
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
    renderItem: function (data, props, key) {
        var className = props.className || 'country-list-item';
        var style = props.style || {};

        return (
            <li
                className={className}
                data-name={data.name}
                data-code={data.code}
                style={makeStyle(style)}
                >
                <span
                    className={className + '-name'}
                    style={style.name || style.countryName}
                    >
                    {data.name}
                </span>
                <span
                    className={className + '-code'}
                    style={style.code || style.countryCode}
                    >
                    {data.code}
                </span>
            </li>
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
        var style = loginStyle.country;

        return (
            <div style={makeStyle(style)}>
                <p style={style.title}>{Lang.countryFormTitle}</p>
                <Search
                    datasource={countries}
                    fields={'name'}
                    defaultValue={Lang.countrySearchTips}
                    onSearch={this._onSearch}
                    style={style.search}
                    />

                <div className="country-list-wrapper" style={makeStyle(style.wrapper)}>
                    <CountryList
                        className="country-list"
                        data={this.state.displayData}
                        onSelect={this._onSelect}
                        style={style.wrapper.countrylist}
                        />
                </div>
            </div>
        )
    }
});

//module initialization


//private functions
