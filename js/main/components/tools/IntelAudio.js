/**
 * Created by Administrator on 2015/8/18.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var classNames = require('classnames');
var Lang = require('../../locales/zh-cn');

// private fields
var AudioPlayState = {
    LOADING: 'default',
    RELOADING: 'reloading',
    READY: 'ready',
    PLAYING: 'playing',
    FAILED: 'error'
};

// exports
module.exports = React.createClass({
    displayName: 'IntelAudio',
    getInitialState: function () {
        return {
            playState: AudioPlayState.LOADING,
            currentTime: 0
        };
    },
    _togglePlay: function (event) {
        var audio = React.findDOMNode(this.refs.audio);

        if (this.state.playState === AudioPlayState.READY) {
            audio && audio.play();
        } else if (this.state.playState === AudioPlayState.PLAYING) {
            audio && audio.pause();
        }
    },

    _handleAudioCanplay: function (event) {
        this.setState({
            playState: AudioPlayState.READY,
            currentTime: this.props.duration
        });
    },
    _handleAudioPlay: function (event) {
        this.setState({
            playState: AudioPlayState.PLAYING,
            currentTime: this.state.currentTime % this.props.duration
        });
    },
    _handleAudioPause: function (event) {
        this.setState({playState: AudioPlayState.READY});
    },
    _handleAudioTimeupdate: function (event) {
        this.setState({
            playState: AudioPlayState.PLAYING,
            currentTime: Math.floor(event.target.currentTime)
        });
    },
    _handleAudioEnded: function (event) {
        this.setState({
            playState: AudioPlayState.READY,
            currentTime: this.props.duration
        });
    },
    _handleAudioEvent: function (event) {
        this['_handleAudio' + _.capitalize(event.type)](event);
    },
    componentDidMount: function () {
        var audio = React.findDOMNode(this.refs.audio);
        if (audio) {
            var event = this.audioEvents = {handleEvent: this._handleAudioEvent};

            audio.addEventListener('canplay', events);
            audio.addEventListener('play', events);
            audio.addEventListener('pause', events);
            audio.addEventListener('timeupdate', events);
            audio.addEventListener('ended', events);
        }
    },
    componentWillMount: function () {
        var audio = React.findDOMNode(this.refs.audio);
        if (audio) {
            var events = this.audioEvents;

            audio.removeEventListener('canplay', events);
            audio.removeEventListener('play', events);
            audio.removeEventListener('pause', events);
            audio.removeEventListener('timeupdate', events);
            audio.removeEventListener('ended', events);
        }
    },
    render: function () {
        if (!this.props.src) {
            return null;
        }

        var timeInfo = this.props.duration;
        var playClass = this.state.playState;

        if (!'audio' in window) {
            timeInfo = Lang.AudioUnsupported;
            playClass = 'unsupported';
        } else if (this.state.playState === AudioPlayState.FAILED) {
            timeInfo = Lang.ReloadAudio;
        } else if (this.state.playState === AudioPlayState.READY || this.state.playState === AudioPlayState.PLAYING) {
            timeInfo = this.state.currentTime;
        }

        return (
            <div className={classNames('audio-player', playClass, this.props.className)}>
                <button className="state" onClick={this._togglePlay}></button>
                <div className="metainfo">
                    <p className="name">{Lang.voiceMessage}</p>
                    <p className="status">{timeInfo}</p>
                </div>
                <audio ref="audio" src={this.props.src} preload/>
            </div>
        )
    }
});

// module initialization


// private functions
