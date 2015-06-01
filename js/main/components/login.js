'use strict';

var React = require('react');

var Login = React.createClass({
    getInitialState: function() {
        return {countrCode: "+86", phoneNumber: ""};
    },
    handleCountryCodeChange: function(event) {
        this.setState({countrCode: event.target.value});
    },
    handlePhoneNumberChange: function(event) {
        this.setState({phoneNumber: event.target.value});
    },
    handleSubmit: function(event) {
        this.props.onSubmit(this.state.countrCode, this.state.phoneNumber);
    },
    render: function() {
        return (
            <div>
                <h3>Sign in</h3>
                <p>Please choose your country and enter your full phone number.</p>
                <div>
                    <label>Country</label>
                    <div autoComplete="off">China</div>
                </div>
                <div>
                    <div>
                        <label>Code</label>
                        <input autoComplete="off" type="tel" onChange={this.handleCountryCodeChange} />
                    </div>
                    <div>
                    <label>Phone number</label>
                        <input required="" autoComplete="off" type="tel" onChange={this.handlePhoneNumberChange} />
                    </div>
                </div>
                <a onClick={this.handleSubmit}>Next</a>
            </div>
        );
    }
});

module.exports = Login;
