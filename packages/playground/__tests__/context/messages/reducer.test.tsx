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
      expect(state.messages[0].id).toBe(0);
      expect(state.messages[0].prompt).toBe('SYSTEM');
      expect(state.messages[0].status).toBe(status);
      expect(state.messages[0].content).toBe(content);
      expect(state.messages[0].severity).toBe('Warning');
      expect(state.nextId).toEqual(1);
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
      expect(state.messages[0].id).toBe(0);
      expect(state.messages[0].prompt).toBe('SYSTEM');
      expect(state.messages[0].status).toBe(status);
      expect(state.messages[0].content).toBe(content);
      expect(state.messages[0].severity).toBe('Success');
      expect(state.nextId).toEqual(0);
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
      expect(state.messages[0].id).toBe(0);
      expect(state.messages[0].prompt).toBe('SYSTEM');
      expect(state.messages[0].status).toBe(status);
      expect(state.messages[0].content).toBe(content);
      expect(state.messages[0].severity).toBe('Info');
      expect(state.nextId).toEqual(1);
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
      expect(state.messages[0].id).toBe(0);
      expect(state.messages[0].prompt).toBe('SYSTEM');
      expect(state.messages[0].status).toBe(status);
      expect(state.messages[0].content).toBe(content);
      expect(state.messages[0].severity).toBe('Error');
      expect(state.nextId).toEqual(1);
    });
  });
});
