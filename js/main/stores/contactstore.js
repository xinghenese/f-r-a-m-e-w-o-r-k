/**
 * Created by Administrator on 2015/7/27.
 */

//dependencies
var _ = require('lodash');

//private fields


//core module to export
module.exports = {
    _data: [
        //the ideal data shape that ContactList components prefer.
        //or you can wrap the properties like 'count', 'online' and other
        //similar ones under a super-level property like 'info' so as to
        //make them more uniform. e.g. {name:'', type: '', info:{}}
        {name: 'Telegram', type: 'group', count: 12},
        {name: 'Designer', type: 'group', count: 20},
        {name: 'xue/er', type: 'contact'},
        {name: 'duoduo', type: 'user', online: true, lastActiveTime: null},
        {name: 'TT', type: 'user', online: false, lastActiveTime: 1},
        {name: 'Telegram', type: 'user', online: false, lastActiveTime: 2}
    ],
    getContacts: function() {
        //immutable
        return _.clone(this._data);
    }
};

//module initialization


//private functions
