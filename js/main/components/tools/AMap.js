/**
 * Created by Administrator on 2015/9/1.
 */
'use strict';

// dependencies
var url = require('url');
var querystring = require('querystring');
var _ = require('lodash');
var React = require('react');

// private fields
var AMapHost = 'restapi.amap.com';
var AMapPathName = 'v3/staticmap';
var defaultScale = 2;
var defaultKey = 'ee95e52bf08006f63fd29bcfbcf21df0';
var defaultMarkers = {
    size: 'mid',
    color: '',
    label: 'A'
};

// exports
module.exports = React.createClass({
    displayName: 'AMap',
    render: function () {
        return <img src={createAMapSourceByDefault(this.props.longitude, this.props.latitude)}/>;
    }
});

// module initialization


// private functions
function createAMapSourceByDefault(longitude, latitude) {
    return createAMapSource(null, null, null, {longitude: longitude, latitude: latitude});
}

function createAMapSource(scale, key, markers, location) {
    scale = scale || defaultScale;
    key = key || defaultKey;
    markers = markers || defaultMarkers;
    location = [location.longitude, location.latitude].join(',');

    return url.format({
        host: AMapHost,
        pathname: AMapPathName,
        search: querystring.stringify({
            scale: scale,
            key: key,
            location: location,
            markers: [
                markers.size,
                markers.color,
                [markers.label, location].join(':')
            ].join(',')
        })
    })
}
