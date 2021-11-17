import { reducer, defaultState, Action } from '~/context/messages/reducer';

describe('Given the reducer is used to manage state', () => {
  describe('When "LOG_SYSTEM" action is dispatched', () => {
    test('When message of type "IN_PROGRESS" is dispatched', () => {
      // Given
      const status = 'IN_PROGRESS';
      const content = 'System message content';
      const action: Action = {
        type: 'LOG_SYSTEM',
        payload: {
          content,
          status,
        },
      };

      // When
      const state = reducer(defaultState, action);

      // Then ...
      expect(state.messages[0]).toMatchObject({
        id: 0,
        prompt: 'SYSTEM',
        status,
        content,
        severity: 'Warning',
      });
      expect(state.nextId).toBe(1);
    });

    test('When message of type "DONE" is dispatched', () => {
      // Given
      const status = 'DONE';
      const content = 'System message content';
      const action: Action = {
        type: 'LOG_SYSTEM',
        payload: {
          content,
          status,
        },
      };

      // When
      const state = reducer(defaultState, action);

      // Then ...
      expect(state.messages[0]).toMatchObject({
        id: 0,
        prompt: 'SYSTEM',
        status,
        content,
        severity: 'Success',
      });
      expect(state.nextId).toBe(0);
    });

    test('When message of type "INFO" is dispatched', () => {
      // Given
      const status = 'INFO';
      const content = 'System message content';
      const action: Action = {
        type: 'LOG_SYSTEM',
        payload: {
          content,
          status,
        },
      };

      // When
      const state = reducer(defaultState, action);

      // Then ...
      expect(state.messages[0]).toMatchObject({
        id: 0,
        prompt: 'SYSTEM',
        status,
        content,
        severity: 'Info',
      });
      expect(state.nextId).toBe(1);
    });

    test('When message of type "ERROR" is dispatched', () => {
      // Given
      const status = 'ERROR';
      const content = 'System message content';
      const action: Action = {
        type: 'LOG_SYSTEM',
        payload: {
          content,
          status,
        },
      };

      // When
      const state = reducer(defaultState, action);

      // Then ...
      expect(state.messages[0]).toMatchObject({
        id: 0,
        prompt: 'SYSTEM',
        status,
        content,
        severity: 'Error',
      });
      expect(state.nextId).toBe(1);
    });
  });
});
