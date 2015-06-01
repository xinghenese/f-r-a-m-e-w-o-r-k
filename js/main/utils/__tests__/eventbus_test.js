'use strict';

jest.autoMockOff();

var keyMirror = require('keymirror');
var EventTypes = keyMirror({
    MOCKED_EVENT: null
});

describe('EventBus', function() {
    var EventBus;

    beforeEach(function() {
        EventBus = require('../eventbus');
    });

    it('add event listeners', function() {
        // given
        var arg = "mockedarg";
        var callback = jest.genMockFunction();

        // when
        EventBus.addListener(EventTypes.MOCKED_EVENT, callback);
        EventBus.dispatch(EventTypes.MOCKED_EVENT, arg);

        // then
        expect(callback).toBeCalledWith(arg);
    });

    it('remove event listeners', function() {
        // given
        var callback = jest.genMockFunction();
        var arg1 = "arg1";
        var arg2 = "arg2";

        // when
        EventBus.addListener(EventTypes.MOCKED_EVENT, callback);
        EventBus.dispatch(EventTypes.MOCKED_EVENT, arg1);
        EventBus.removeListener(EventTypes.MOCKED_EVENT, callback);
        EventBus.dispatch(EventTypes.MOCKED_EVENT, arg2);

        // then
        expect(callback).toBeCalledWith(arg1);
        expect(callback.mock.calls.length).toBe(1);
    });

    it('has listener', function() {
        // given
        var callback = jest.genMockFunction();

        // when
        EventBus.addListener(EventTypes.MOCKED_EVENT, callback);

        // then
        expect(EventBus.hasListener(EventTypes.MOCKED_EVENT, callback)).toBe(true);

        // when
        EventBus.removeListener(EventTypes.MOCKED_EVENT, callback);

        // then
        expect(EventBus.hasListener(EventTypes.MOCKED_EVENT, callback)).toBe(false);
    });
});
