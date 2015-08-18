/**
 * Created by Administrator on 2015/8/18.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');

// private fields
var ImageLoadState = {
    LOADING: 0,
    RELOADING: 1,
    LOADED: 2,
    FAILED: 3
};

// exports
/**
 * <IntelImage src={String} width={Number|String} height={Number|String} onError={Function} onLoad={Function}/>
 * @type {*|Function}
 */
module.exports = React.createClass({
    displayName: 'IntelImage',
    getDefaultProps: function () {
        return {
            reloadMaxTimes: 3,
            width: '100%',
            height: '100%'
        }
    },
    getInitialState: function () {
        return {
            loadState: ImageLoadState.LOADING,
            failedTimes: 0
        };
    },
    _onError: function (event) {
        var currentFailedTimes = this.state.failedTimes + 1;
        if (currentFailedTimes > this.props.reloadMaxTimes) {
            this.setState({loadState: ImageLoadState.FAILED});
            if (_.isFunction(this.props.onError)) {
                this.props.onError(event);
            }
        } else {
            this.setState({
                failedTimes: currentFailedTimes,
                loadState: ImageLoadState.RELOADING
            });
        }
    },
    _onLoad: function (event) {
        this.state.loadState = ImageLoadState.LOADED;
        if (_.isFunction(this.props.onLoad)) {
            this.props.onLoad(event);
        }
    },
    render: function () {
        if (!this.props.src) {
            return null;
        }

        if (this.state.loadState === ImageLoadState.FAILED) {
            return _.isFunction(this.props.replacedElementOnError)
                && this.props.replacedElementOnError(this.props) || null;
        }

        var otherProps = _.omit(this.props, ['onLoad', 'onError']);

        if (this.state.loadState === ImageLoadState.RELOADING) {
            otherProps.src = this.props.src + '?' + Number(new Date());
        }

        return (
            <img {...otherProps} onLoad={this._onLoad} onError={this._onError} />
        )
    }
});

// module initialization


// private functions
