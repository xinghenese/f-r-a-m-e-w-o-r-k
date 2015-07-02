/**
 * Created by Administrator on 2015/7/2.
 */

//dependencies
var React = require('react');
var Mask = require('./Mask');
var Lang = require('../../locales/zh-cn');
var makeStyle = require('../../style/styles').makeStyle;
var commonStyle = require('../../style/common');
var defaultStyle = require('../../style/default');

//private fields


//core module to export
var MessageBox = React.createClass({
  propTypes: {
    style: React.PropTypes.object,
    masked: React.PropTypes.boolean,
    title: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      masked: true
    };
  },
  render: function() {
    var style = this.props.style || {};
    var box = (
      <div className="messagebox" style={makeStyle(style)}>
        <div className="messagbox-header" style={makeStyle(style.header)}>
          {this.props.title}
        </div>
        <div className="messagebox-body" style={makeStyle(style.body)}>
          <div className="messagebox-message" style={style.body ? makeStyle(style.body.message) : void 0}>
            {this.props.children}
          </div>
        </div>
        <div className="messagebox-footer" style={makeStyle(style.footer)}>
          <input type="button" value={Lang.confirm} style={makeStyle(style.button, style.footer ? style.footer.confirm : void 0)}/>
          <input type="button" value={Lang.cancel} style={makeStyle(style.button, style.footer ? style.footer.cancel : void 0)}/>
        </div>
      </div>
    );

    if (this.props.masked) {
      return <Mask style={style.mask}>{box}</Mask>;
    }
    return box;
  }
});

module.exports = MessageBox;

//module initialization


//private functions
