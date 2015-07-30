/**
 * Created by Administrator on 2015/7/30.
 */
'use strict';

//dependencies
var _  = require('lodash');
var React = require('react');
var Search = require('./tools/Search');
var loginStyle = require('../style/login');
var makeStyle = require('../style/styles').makeStyle;
var Lang = require('../locales/zh-cn');
var countries = require('../constants/countries');

//private fields
var CountryList = React.createClass({
    _onSelect: function(event) {
        var target = event.target;
        this.props.onSelect({
            countryName: target.getAttribute('data-name'),
            countryCode: target.getAttribute('data-code')
        })
    },
    render: function() {
        var data = this.props.data;
        var style = this.props.style || {};

        if (!data || _.isEmpty(data)) {
            return null;
        }

        var children = _.map(data, function(countryInfo, index) {

            var name = countryInfo.name;
            var code = countryInfo.code;
            var itemStyle = style.item || style.countryItem || {};

            return (
                <li
                    key={code + index}
                    className="country-list-item"
                    data-name={name}
                    data-code={code}
                    style={makeStyle(itemStyle)}
                >
                    <span
                        className="country-name"
                        style={itemStyle.name || itemStyle.countryName}
                    >
                        {name}
                    </span>
                    <span
                        className="country-code"
                        style={itemStyle.code || itemStyle.countryCode}
                    >
                        {code}
                    </span>
                </li>
            )
        });

        return (
            <ul className="country-list" onClick={this._onSelect} style={makeStyle(style)}>
                {children}
            </ul>
        );
    }
});

//core module to export
var CountryForm = React.createClass({
    getInitialState: function() {
        return {displayData: countries};
    },
    _onSelect: function(countryInfo) {
        this.props.onCountryCodeSelected(countryInfo);
    },
    _onSearch: function(data) {
        this.setState({displayData: data ? data.name : countries});
    },
    render: function() {
        var style = loginStyle.country;

        return (
            <div style={makeStyle(style)} >
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
                        data={this.state.displayData}
                        onSelect={this._onSelect}
                        style={style.wrapper.countrylist}
                    />
                </div>
            </div>
        )
    }
});

module.exports = CountryForm;

//module initialization


//private functions
