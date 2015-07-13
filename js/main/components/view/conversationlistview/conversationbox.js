/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var ConversationList = require('./conversationlist');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
//var store = require('../../../stores/conversationliststore');
var Search = require('../../tools/Search');
var Lang = require('../../../locales/zh-cn');
var emitter = require('../../../utils/eventemitter.thenable');

//private fields

//core module to export
var ConversationBox = React.createClass({
    getInitialState: function(){
      return {
          data: _.get(this.props.store, 'ConversationStore')
      };
    },
    render: function() {
        var datas = fetchLastMessages(this.state.data);

      return (
          <div className="conversation-list-box" style={makeStyle(style)}>
              <div className="conversation-list-box-header"
                  style={makeStyle(style.header)}
              >
                  <div
                      className="conversation-list-search"
                      style={makeStyle(style.header.searchbar)}
                  >
                      <Search
                          defaultValue={Lang.search}
                          datasource={datas}
                          controllers={['switcher']}
                          style={style.header.searchbar.search}
                          ref="search"
                      />
                  </div>
              </div>
              <ConversationList
                  initialData={datas}
                  controllers={['switcher', 'search']}
              />
              <div className="conversation-list-box-footer"
                  style={makeStyle(style.footer)}
                  datasource={this.props.store}
                  ref="switcher"
              >
              </div>
          </div>
      )
    }
});

module.exports = ConversationBox;

//module initialization


//private functions
function fetchLastMessages(data) {
    return _.mapValues(data, function(value, key) {
        return _.isArray(value) ? _.last(value) : value;
    });
}