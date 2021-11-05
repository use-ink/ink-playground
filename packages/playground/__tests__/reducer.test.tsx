import { reducer, defaultState, CompileState, Action } from '~/context/reducer';

describe('Given the reducer is used to manage state', () => {
  test('When dark mode is toggled', () => {
    const deactivated = reducer(defaultState, { type: 'SET_DARKMODE', payload: false });
    const activated = reducer(defaultState, { type: 'SET_DARKMODE', payload: true });
    // Then ...
    expect(deactivated.darkmode).toBeFalsy();
    expect(activated.darkmode).toBeTruthy();
  });

  test('When numbering is toggled', () => {
    const deactivated = reducer(defaultState, { type: 'SET_NUMBERING', payload: false });
    const activated = reducer(defaultState, { type: 'SET_NUMBERING', payload: true });
    // Then ...
    expect(deactivated.numbering).toBeFalsy();
    expect(activated.numbering).toBeTruthy();
  });

  test('When minimap is toggled', () => {
    const deactivated = reducer(defaultState, { type: 'SET_MINIMAP', payload: false });
    const activated = reducer(defaultState, { type: 'SET_MINIMAP', payload: true });
    // Then ...
    expect(deactivated.minimap).toBeFalsy();
    expect(activated.minimap).toBeTruthy();
  });

  test('When compile state is set to "IN_PROGRESS"', () => {
    const type = 'SET_COMPILE_STATE';
    const payload: CompileState = {
      type: 'IN_PROGRESS',
    };
    const action: Action = {
      type,
      payload,
    };
    const resultingState = reducer(defaultState, action);
    // Then ...
    expect(resultingState.compile).toStrictEqual(payload);
  });

  test('When endpoint returns "NETWORK_ERROR"', () => {
    const type = 'SET_COMPILE_STATE';
    const payload: CompileState = {
      type: 'RESULT',
      payload: {
        type: 'NETWORK_ERROR',
      },
    };
    const action: Action = {
      type,
      payload,
    };
    const resultingState = reducer(defaultState, action);
    // Then ...
    expect(resultingState.compile).toStrictEqual(payload);
  });

  test('When endpoint returns "SERVER_ERROR"', () => {
    const type = 'SET_COMPILE_STATE';
    const payload: CompileState = {
      type: 'RESULT',
      payload: {
        type: 'SERVER_ERROR',
        payload: {
          status: 404,
        },
      },
    };
    const action: Action = {
      type,
      payload,
    };
    const resultingState = reducer(defaultState, action);
    // Then ...
    expect(resultingState.compile).toStrictEqual(payload);
  });

  test('When endpoint returns "OK" with "FAILURE"', () => {
    const type = 'SET_COMPILE_STATE';
    const payload: CompileState = {
      type: 'RESULT',
      payload: {
        type: 'OK',
        payload: {
          type: 'FAILURE',
          payload: {
            message: 'Compile failed',
          },
        },
      },
    };
    const action: Action = {
      type,
      payload,
    };
    const resultingState = reducer(defaultState, action);
    // Then ...
    expect(resultingState.compile).toStrictEqual(payload);
  });

  test('When endpoint returns "OK" with "SUCCESS"', () => {
    const type = 'SET_COMPILE_STATE';
    const payload: CompileState = {
      type: 'RESULT',
      payload: {
        type: 'OK',
        payload: {
          type: 'SUCCESS',
          payload: {
            result: 'Compile result',
          },
        },
      },
    };
    const action: Action = {
      type,
      payload,
    };
    const resultingState = reducer(defaultState, action);
    // Then ...
    expect(resultingState.compile).toStrictEqual(payload);
  });
});
