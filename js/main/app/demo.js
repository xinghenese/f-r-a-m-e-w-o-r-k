/**
 * Created by Administrator on 2015/6/4.
 */

//var React = require('react');
////var app = require('../components/app');
//var App = require('../components/chatmessagebox');
//
////
//React.render(
//  <App/>,
//  document.getElementById('content')
//);

var Page  = require('../components/hierarchy/Page');
var DataHolder = require('../components/hierarchy/DataHolder');
var React = require('react');

var ConversationList = require('../components/view/conversationlistview/conversationlist');
var ChatMessageList = require('../components/view/chatview/chatmessagelist');

React.render(
    <Page className="testPage">
        <DataHolder handler={'BottomSwitcher'} domPath={'/div#SideList.slide1/'}>
            <DataHolder handler={'TopSearchBar'} domPath={'/div#SideList.slide1/'}>
                <DataHolder handler={'ConversationList'} domPath={'/div#SideList.slide1/'}>
                    <DataHolder handler={ChatMessageList} domPath={'/div#ChatBox.box1/'}/>
                </DataHolder>
            </DataHolder>
        </DataHolder>
    </Page>,
    document.getElementById('content')
);

console.log('init');