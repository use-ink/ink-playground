import { reducer, defaultState, MessageAction } from '~/context/messages/reducer';

describe('Given the reducer is used to manage state', () => {
  describe('When "LOG_SYSTEM" action is dispatched', () => {
    test('When message of type "IN_PROGRESS" is dispatched', () => {
      // Given
      const status = 'IN_PROGRESS';
      const content = 'System message content';
      const action: MessageAction = {
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
        severity: 'InProgress',
      });
      expect(state.nextId).toBe(1);
    });

    test('When message of type "DONE" is dispatched', () => {
      // Given
      const status = 'DONE';
      const content = 'System message content';
      const action: MessageAction = {
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

    test('When message of type "ERROR" is dispatched', () => {
      // Given
      const status = 'ERROR';
      const content = 'System message content';
      const action: MessageAction = {
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
      expect(state.nextId).toBe(0);
    });

    test('When message of type "INFO" is dispatched', () => {
      // Given
      const status = 'INFO';
      const content = 'System message content';
      const action: MessageAction = {
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
  });

  describe('When "LOG_COMPILE" action is dispatched', () => {
    test('When message of type "IN_PROGRESS" is dispatched', () => {
      // Given
      const status = 'IN_PROGRESS';
      const content = 'Compile message content';
      const action: MessageAction = {
        type: 'LOG_COMPILE',
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
        prompt: 'COMPILE',
        status,
        content,
        severity: 'InProgress',
      });
      expect(state.nextId).toBe(1);
    });

    test('When message of type "DONE" is dispatched', () => {
      // Given
      const status = 'DONE';
      const content = 'Compile message content';
      const action: MessageAction = {
        type: 'LOG_COMPILE',
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
        prompt: 'COMPILE',
        status,
        content,
        severity: 'Success',
      });
      expect(state.messages[1]).toMatchObject({
        id: 0,
        prompt: 'COMPILE',
        status: 'INFO',
        content: 'This is your compile Result: <Result>',
        severity: 'Info',
      });
      expect(state.nextId).toBe(1);
    });

    test('When message of type "ERROR" is dispatched', () => {
      // Given
      const status = 'ERROR';
      const content = 'Compile message content';
      const action: MessageAction = {
        type: 'LOG_COMPILE',
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
        prompt: 'COMPILE',
        status,
        content: 'There was an error compiling your contract: <Error>',
        severity: 'Error',
      });
      expect(state.nextId).toBe(1);
    });

    test('When message of type "INFO" is dispatched', () => {
      // Given
      const status = 'INFO';
      const content = 'Compile message content';
      const action: MessageAction = {
        type: 'LOG_COMPILE',
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
        prompt: 'COMPILE',
        status,
        content,
        severity: 'Info',
      });
      expect(state.nextId).toBe(1);
    });
  });

  describe('When "LOG_GIST" action is dispatched', () => {
    test('When message of type "IN_PROGRESS" is dispatched', () => {
      // Given
      const status = 'IN_PROGRESS';
      const content = 'Gist message content';
      const action: MessageAction = {
        type: 'LOG_GIST',
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
        prompt: 'GIST',
        status,
        content,
        severity: 'InProgress',
      });
      expect(state.nextId).toBe(1);
    });

    test('When message of type "DONE" is dispatched', () => {
      // Given
      const status = 'DONE';
      const content = 'Gist message content';
      const action: MessageAction = {
        type: 'LOG_GIST',
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
        prompt: 'GIST',
        status,
        content,
        severity: 'Success',
      });
      expect(state.nextId).toBe(0);
    });

    test('When message of type "ERROR" is dispatched', () => {
      // Given
      const status = 'ERROR';
      const content = 'Gist message content';
      const action: MessageAction = {
        type: 'LOG_GIST',
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
        prompt: 'GIST',
        status,
        content,
        severity: 'Error',
      });
      expect(state.nextId).toBe(0);
    });

    test('When message of type "INFO" is dispatched', () => {
      // Given
      const status = 'INFO';
      const content = 'Gist message content';
      const action: MessageAction = {
        type: 'LOG_GIST',
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
        prompt: 'GIST',
        status,
        content,
        severity: 'Info',
      });
      expect(state.nextId).toBe(1);
    });
  });
});
