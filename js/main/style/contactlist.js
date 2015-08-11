/**
 * Created by Administrator on 2015/8/10.
 */
'use strict';

// dependencies
var conversationlist = require('./conversationlist');

// private fields


// exports
module.exports = {
    contactlist: {
        //group
        group: {
            //title
            title: {
                //caption
                caption: {
                    height: "30px",
                    lineHeight: "30px",
                    padding: "0 14px",
                    color: "#282828",
                    background: "#fafafa",
                    fontSize: "14px"
                }
            },
            //item
            item: conversationlist.conversationlist.item
        }
    }
};

// module initialization


// private functions
