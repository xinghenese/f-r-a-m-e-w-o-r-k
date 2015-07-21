/**
 * Created by Administrator on 2015/7/13.
 */

//dependencies


//private fields
var ConversationStore = {
    kim0: [
        {
            senderName: 'kim0',
            senderAvatar: '',
            message: 'event.data',
            time: (new Date()).toLocaleTimeString()
        }
    ],
    kim1: [
        {
            senderName: 'kim1',
            senderAvatar: '',
            message: 'ok，3Q &lt;br/&gt; HTTP API 协议文档 上能否写下',
            time: (new Date()).toLocaleTimeString()
        }
    ],
    kim2: [
        {
            senderName: 'kim2',
            senderAvatar: '',
            message: '议文档 上能否写下',
            time: (new Date()).toLocaleTimeString()
        }
    ],
    kim3: [
        {
            senderName: 'kim3',
            senderAvatar: '',
            message: 'data.event.',
            time: (new Date()).toLocaleTimeString()
        }
    ],
    kim4: [
        {
            senderName: 'kim4',
            senderAvatar: '',
            message: 'TP API 协议文档 上能否写下',
            time: (new Date()).toLocaleTimeString()
        }
    ],
    kim5: [
        {
            senderName: 'kim5',
            senderAvatar: '',
            message: 'ok，3Q &lt;br/&gt; HT议文档 上能否写下',
            time: (new Date()).toLocaleTimeString()
        }
    ]
};

var UserStore = {
    kim0: [],
    kim1: [],
    kim2: [],
    kim3: [],
    kim4: [],
    kim5: []
};

//core module to export
module.exports = {
    ConversationStore: ConversationStore,
    UserStore: UserStore
};

//module initialization


//private functions
