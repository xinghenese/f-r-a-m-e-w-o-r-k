"use strict";

jest.autoMockOff();

describe('AppDispatcher', function() {
    var AppDispatcher;
    var ActionTypes;

    beforeEach(function() {
        AppDispatcher = require('../../dispatchers/AppDispatcher');
        ActionTypes = require('../../constants/actiontypes');
    });

    it('sends actions to subscribers', function() {
        var listener = jest.genMockFunction();
        AppDispatcher.register(listener);

        var action = {type: ActionTypes.LOGIN};
        AppDispatcher.dispatch(action);
        expect(listener.mock.calls.length).toBe(1);
        expect(listener.mock.calls[0][0]).toBe(action);
    });
});
