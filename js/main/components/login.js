'use strict';

var _ = require('lodash');
var React = require('react');
var Lang = require('../locales/zh-cn');
var Styles = require('../constants/styles');
var style = require('../style/login');
var makeStyle = require('../style/stylenormalizer');

var Countries = [
    {"name": "阿尔巴尼亚", "code": "+355"},
    {"name": "阿尔及利亚", "code": "+213"},
    {"name": "阿富汗", "code": "+93"},
    {"name": "阿根廷", "code": "+54"},
    {"name": "阿拉伯联合酋长国", "code": "+971"},
    {"name": "阿鲁巴岛", "code": "+297"},
    {"name": "阿曼", "code": "+968"},
    {"name": "阿塞拜疆", "code": "+994"},
    {"name": "埃及", "code": "+20"},
    {"name": "埃塞俄比亚", "code": "+251"},
    {"name": "爱尔兰", "code": "+353"},
    {"name": "爱沙尼亚", "code": "+372"},
    {"name": "安道尔", "code": "+376"},
    {"name": "安哥拉", "code": "+244"},
    {"name": "安圭拉", "code": "+1264"},
    {"name": "安提瓜和巴布达", "code": "+1268"},
    {"name": "奥地利", "code": "+43"},
    {"name": "澳大利亚", "code": "+61"},
    {"name": "澳门", "code": "+853"},
    {"name": "巴巴多斯", "code": "+1246"},
    {"name": "巴布亚新几内亚", "code": "+675"},
    {"name": "巴哈马", "code": "+1242"},
    {"name": "巴基斯坦", "code": "+92"},
    {"name": "巴拉圭", "code": "+595"},
    {"name": "巴勒斯坦", "code": "+970"},
    {"name": "巴林", "code": "+973"},
    {"name": "巴拿马", "code": "+507"},
    {"name": "巴西", "code": "+55"},
    {"name": "白俄罗斯", "code": "+375"},
    {"name": "百慕大", "code": "+1441"},
    {"name": "保加利亚", "code": "+359"},
    {"name": "贝宁", "code": "+229"},
    {"name": "比利时", "code": "+32"},
    {"name": "冰岛", "code": "+354"},
    {"name": "波多黎各", "code": "+1787"},
    {"name": "波黑", "code": "+387"},
    {"name": "波兰", "code": "+48"},
    {"name": "玻利维亚", "code": "+591"},
    {"name": "伯利兹", "code": "+501"},
    {"name": "博茨瓦纳", "code": "+267"},
    {"name": "不丹", "code": "+975"},
    {"name": "布基拉法索", "code": "+226"},
    {"name": "布隆迪", "code": "+257"},
    {"name": "朝鲜", "code": "+850"},
    {"name": "赤道几内亚", "code": "+240"},
    {"name": "丹麦", "code": "+45"},
    {"name": "东帝汶", "code": "+670"},
    {"name": "德国", "code": "+49"},
    {"name": "多哥", "code": "+228"},
    {"name": "多米尼加共和国", "code": "+1809"},
    {"name": "多米尼克", "code": "+1767"},
    {"name": "俄罗斯", "code": "+7"},
    {"name": "厄瓜多尔", "code": "+593"},
    {"name": "厄立特里亚", "code": "+291"},
    {"name": "法国", "code": "+33"},
    {"name": "福克兰群岛", "code": "+500"},
    {"name": "法罗群岛", "code": "+298"},
    {"name": "法属波利尼西亚", "code": "+689"},
    {"name": "法属圭亚那", "code": "+594"},
    {"name": "梵蒂冈", "code": "+379"},
    {"name": "菲律宾", "code": "+63"},
    {"name": "斐济", "code": "+679"},
    {"name": "芬兰", "code": "+358"},
    {"name": "佛得角", "code": "+238"},
    {"name": "冈比亚", "code": "+220"},
    {"name": "古巴", "code": "+53"},
    {"name": "关岛", "code": "+1671"},
    {"name": "刚果", "code": "+242"},
    {"name": "刚果民主共和国", "code": "+243"},
    {"name": "哥伦比亚", "code": "+57"},
    {"name": "哥斯达黎加", "code": "+506"},
    {"name": "格林纳达", "code": "+1473"},
    {"name": "格陵兰岛", "code": "+299"},
    {"name": "格鲁吉亚", "code": "+995"},
    {"name": "瓜德罗普", "code": "+590"},
    {"name": "根西岛", "code": "+1481"},
    {"name": "圭亚那", "code": "+592"},
    {"name": "海地", "code": "+509"},
    {"name": "韩国", "code": "+82"},
    {"name": "荷兰", "code": "+31"},
    {"name": "荷属安的列斯", "code": "+599"},
    {"name": "洪都拉斯", "code": "+504"},
    {"name": "哈萨克斯坦", "code": "+73"},
    {"name": "黑山", "code": "+382"},
    {"name": "津巴布韦", "code": "+263"},
    {"name": "吉布提", "code": "+253"},
    {"name": "加拿大", "code": "+1"},
    {"name": "吉尔吉斯斯坦", "code": "+996"},
    {"name": "几内亚", "code": "+224"},
    {"name": "几内亚比绍", "code": "+245"},
    {"name": "加纳", "code": "+233"},
    {"name": "加蓬", "code": "+241"},
    {"name": "柬埔寨", "code": "+855"},
    {"name": "捷克", "code": "+420"},
    {"name": "喀麦隆", "code": "+237"},
    {"name": "卡塔尔", "code": "+974"},
    {"name": "库克群岛", "code": "+682"},
    {"name": "开曼群岛", "code": "+1345"},
    {"name": "科摩罗", "code": "+269"},
    {"name": "科索沃", "code": "+883"},
    {"name": "科特迪瓦", "code": "+225"},
    {"name": "科威特", "code": "+965"},
    {"name": "克罗地亚", "code": "+385"},
    {"name": "肯尼亚", "code": "+254"},
    {"name": "拉脱维亚", "code": "+371"},
    {"name": "莱索托", "code": "+266"},
    {"name": "老挝", "code": "+856"},
    {"name": "黎巴嫩", "code": "+961"},
    {"name": "立陶宛", "code": "+370"},
    {"name": "利比里亚", "code": "+231"},
    {"name": "利比亚", "code": "+218"},
    {"name": "列支敦士登", "code": "+423"},
    {"name": "留尼旺岛", "code": "+262"},
    {"name": "卢森堡", "code": "+352"},
    {"name": "卢旺达", "code": "+250"},
    {"name": "罗马尼亚", "code": "+40"},
    {"name": "马达加斯加", "code": "+261"},
    {"name": "马尔代夫", "code": "+960"},
    {"name": "马耳他", "code": "+356"},
    {"name": "马恩岛", "code": "+44"},
    {"name": "马拉维", "code": "+265"},
    {"name": "马来西亚", "code": "+60"},
    {"name": "马里", "code": "+223"},
    {"name": "马其顿", "code": "+389"},
    {"name": "马提尼克", "code": "+596"},
    {"name": "毛里求斯", "code": "+230"},
    {"name": "毛里塔尼亚", "code": "+222"},
    {"name": "美国", "code": "+1"},
    {"name": "美属萨摩亚", "code": "+1684"},
    {"name": "蒙古", "code": "+976"},
    {"name": "蒙塞拉特岛", "code": "+1664"},
    {"name": "蒙特內哥羅", "code": "+382"},
    {"name": "孟加拉国", "code": "+880"},
    {"name": "秘鲁", "code": "+51"},
    {"name": "缅甸", "code": "+95"},
    {"name": "摩尔多瓦", "code": "+373"},
    {"name": "摩洛哥", "code": "+212"},
    {"name": "摩纳哥", "code": "+377"},
    {"name": "莫桑比克", "code": "+258"},
    {"name": "墨西哥", "code": "+52"},
    {"name": "纳米比亚", "code": "+264"},
    {"name": "南非", "code": "+672"},
    {"name": "南极洲", "code": "+27"},
    {"name": "尼泊尔", "code": "+977"},
    {"name": "尼加拉瓜", "code": "+505"},
    {"name": "尼日尔", "code": "+227"},
    {"name": "尼日利亚", "code": "+234"},
    {"name": "挪威", "code": "+47"},
    {"name": "帕劳", "code": "+680"},
    {"name": "葡萄牙", "code": "+351"},
    {"name": "千里达及托巴哥", "code": "+1868"},
    {"name": "日本", "code": "+81"},
    {"name": "瑞典", "code": "+46"},
    {"name": "瑞士", "code": "+41"},
    {"name": "圣基茨和尼维斯", "code": "+1869"},
    {"name": "圣卢西亚", "code": "+1758"},
    {"name": "圣马力诺", "code": "+378"},
    {"name": "圣文森特和格林纳丁斯", "code": "+1784"},
    {"name": "斯里兰卡", "code": "+94"},
    {"name": "斯洛伐克", "code": "+421"},
    {"name": "斯洛文尼亚", "code": "+386"},
    {"name": "斯威士兰", "code": "+268"},
    {"name": "苏丹", "code": "+249"},
    {"name": "苏里南", "code": "+597"},
    {"name": "索马里", "code": "+252"},
    {"name": "所罗门群岛", "code": "+677"},
    {"name": "沙特阿拉伯", "code": "+966"},
    {"name": "塞舌尔", "code": "+248"},
    {"name": "塞浦路斯", "code": "+357"},
    {"name": "塞内加尔", "code": "+221"},
    {"name": "塞拉利昂", "code": "+232"},
    {"name": "塞尔维亚", "code": "+381"},
    {"name": "萨尔瓦多", "code": "+503"},
    {"name": "萨摩亚", "code": "+685"},
    {"name": "汤加", "code": "+676"},
    {"name": "坦桑尼亚", "code": "+255"},
    {"name": "泰国", "code": "+66"},
    {"name": "台湾", "code": "+886"},
    {"name": "特克斯和凯科斯群岛", "code": "+1649"},
    {"name": "特立尼达和多巴哥", "code": "+1868"},
    {"name": "突尼斯", "code": "+216"},
    {"name": "土耳其", "code": "+90"},
    {"name": "土库曼斯坦", "code": "+993"},
    {"name": "塔吉克斯坦", "code": "+992"},
    {"name": "乌兹别克斯坦", "code": "+998"},
    {"name": "乌拉圭", "code": "+598"},
    {"name": "乌克兰", "code": "+380"},
    {"name": "乌干达", "code": "+256"},
    {"name": "文莱", "code": "+673"},
    {"name": "委内瑞拉", "code": "+58"},
    {"name": "瓦努阿图", "code": "+678"},
    {"name": "危地马拉", "code": "+502"},
    {"name": "叙利亚", "code": "+963"},
    {"name": "匈牙利", "code": "+36"},
    {"name": "新西兰", "code": "+64"},
    {"name": "新喀里多尼亚", "code": "+687"},
    {"name": "新加坡", "code": "+65"},
    {"name": "香港", "code": "+852"},
    {"name": "希腊", "code": "+30"},
    {"name": "西班牙", "code": "+34"},
    {"name": "越南", "code": "+84"},
    {"name": "约旦", "code": "+962"},
    {"name": "英属维尔京群岛", "code": "+1284"},
    {"name": "英国", "code": "+44"},
    {"name": "印度尼西亚", "code": "+62"},
    {"name": "印度", "code": "+91"},
    {"name": "意大利", "code": "+39"},
    {"name": "以色列", "code": "+972"},
    {"name": "伊朗", "code": "+98"},
    {"name": "伊拉克", "code": "+964"},
    {"name": "也门", "code": "+967"},
    {"name": "亚美尼亚", "code": "+374"},
    {"name": "牙买加", "code": "+1876"},
    {"name": "中非", "code": "+236"},
    {"name": "中国", "code": "+86"},
    {"name": "智利", "code": "+56"},
    {"name": "直布罗陀", "code": "+350"},
    {"name": "乍得", "code": "+235"},
    {"name": "赞比亚", "code": "+260"},
    {"name": "泽西岛", "code": "+44"}
];

var Login = React.createClass({
    getInitialState: function() {
        return {
            countryName: "中国",
            countryCode: "+86",
            phoneNumber: "",
            promptInvalidPhone: false
        };
    },
    _handleCountryNameChange: function(event) {
        var name = event.target.value;
        var code = this._getCountryCode(name);
        this.setState({countryName: name, countryCode: code});
    },
    _handleCountryCodeChange: function(event) {
        var code = event.target.value;
        var name = this._getCountryName(code);
        this.setState({countryName: name, countryCode: code});
    },
    _handlePhoneNumberChange: function(event) {
        this.setState({phoneNumber: event.target.value});
    },
    _handleSubmit: function() {
        if (!this._validatePhoneNumber()) {
            this.setState({promptInvalidPhone: true});
            React.findDOMNode(this.refs.phone).focus();
        } else {
            this.props.onSubmit(this.state.countryCode, this.state.phoneNumber);
        }
    },
    _getCountryName: function(code) {
        for (var i = 0; i < Countries.length; i++) {
            var country = Countries[i];
            if (country.code == code) {
                return country.name;
            }
        }
        return Lang.unknown;
    },
    _getCountryCode: function() {
        for (var i = 0; i < Countries.length; i++) {
            var country = Countries[i];
            if (this.state.countryName == country.name) {
                return country.code;
            }
        }
        return "";
    },
    _validatePhoneNumber: function() {
        return /^(?:13\d|15[89])-?\d{5}(\d{3}|\*{3})$/.test(this.state.phoneNumber);
    },
    render: function() {
        var phonePrompt = Lang.phone;
        var phoneLableStyle = makeStyle(style.login.form.label);
        if (this.state.promptInvalidPhone) {
            phonePrompt = Lang.invalidPhone;
            _.assign(phoneLableStyle, {
              color: Styles.ERROR_TEXT_COLOR
            });
        }
        return (
            <div style={makeStyle(style.login)}>
                <div className="login-form" style={makeStyle(style.login.form)}>
                    <p style={makeStyle(style.login.form.title)}>{Lang.loginTitle}</p>
                    <p style={makeStyle(style.login.form.p)}>{Lang.loginSubTitle}</p>

                    <div className="login-form-country-name" style={makeStyle(style.login.form.countryName)}>
                        <label style={makeStyle(style.login.form.label)}>{Lang.country}</label>
                        <input
                            style={makeStyle(style.login.form.input)}
                            autoComplete="off" type="tel"
                            onChange={this._handleCountryNameChange}
                            onBlur={onInputBlur}
                            onFocus={onInputFocus}
                            placeholder={this.state.countryName}
                        />
                    </div>
                    <div>
                        <div className="login-form-country-code" style={makeStyle(style.login.form.countryCode)}>
                            <label style={phoneLableStyle}>{Lang.code}</label>
                            <input
                                style={makeStyle(style.login.form.input)}
                                autoComplete="off"
                                type="tel"
                                onChange={this._handleCountryCodeChange}
                                onBlur={onInputBlur}
                                onFocus={onInputFocus}
                                placeholder={this.state.countryCode}
                            />
                        </div>
                        <div className="login-form-phone-number" style={makeStyle(style.login.form.phoneNumber)}>
                            <label style={phoneLableStyle}>{phonePrompt}</label>
                            <input
                                style={makeStyle(style.login.form.input)}
                                required=""
                                ref="phone"
                                autoComplete="off" type="tel"
                                onBlur={onInputBlur}
                                onFocus={onInputFocus}
                                onChange={this._handlePhoneNumberChange}
                            />
                        </div>
                    </div>
                    <div>
                        <input
                            type="submit"
                            value={Lang.next}
                            style={style.login.form.button}
                            onClick={this._handleSubmit}
                        />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Login;

//private functions
function onInputBlur(event){
  event.target.style.borderBottom = style.login.form.input.borderBottom;
}

function onInputFocus(event){
  event.target.style.borderBottom = style.login.form.inputFocus.borderBottom;
}