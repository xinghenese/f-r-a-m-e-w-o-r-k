/**
 * Created by Administrator on 2015/7/15.
 */

//dependencies
var _ = require('lodash');

//private fields
var tagMap = {
    HSK: 'HSK',
    AUTH: 'AUTH',
    P: 'P',
    TM: 'SFC'
};

//core module to export
module.exports = {
    getResponseTag: function(tag) {
        return _.get(tagMap, tag);
    }
};

//module initialization


//private functions
