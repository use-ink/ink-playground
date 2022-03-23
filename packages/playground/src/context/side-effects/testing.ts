import { TestingApiResponse, testingRequest } from '@paritytech/ink-editor/api/testing';
import { State, Dispatch } from '~/context/app/reducer';
import { MessageAction, MessageDispatch } from '~/context/messages/reducer';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { TESTING_URL } from '~/env';

const getMessageAction = (result: TestingApiResponse): MessageAction | undefined => {
  switch (result.type) {
    case 'NETWORK_ERROR':
      return {
        type: 'LOG_TESTING',
        payload: {
          content: 'Network Error',
          status: 'ERROR',
        },
      };
    case 'SERVER_ERROR':
      return {
        type: 'LOG_TESTING',
        payload: {
          content: `Server Error: ${result.payload.status}`,
          status: 'ERROR',
        },
      };
    case 'OK':
      if (result.payload.type === 'ERROR') {
        return {
          type: 'LOG_TESTING',
          payload: {
            content: `Testing Error: ${result.payload.payload.stdout}, ${result.payload.payload.stderr}`,
            status: 'ERROR',
          },
        };
      } else if (result.payload.type === 'SUCCESS') {
        return {
          type: 'LOG_TESTING',
          payload: {
            content: 'Testing finished',
            status: 'DONE',
            result: result.payload,
          },
        };
      }
  }
};

function interpret_response(response: TestingApiResponse): TestingApiResponse {
  if (response.type === 'OK' && response.payload.type === 'SUCCESS') {
    const has_test_error = /ERROR:/.test(response.payload.payload.stdout);
    if (has_test_error) {
      const result = Object.assign(response, {
        ...response,
        payload: { ...response.payload, type: 'ERROR' },
      });
      return result;
    }
  }
  return response;
}

export async function testing(state: State, dispatch: Dispatch, dispatchMessage: MessageDispatch) {
  if (state.compile.type === 'IN_PROGRESS') return;

  dispatch({ type: 'SET_TESTING_STATE', payload: { type: 'IN_PROGRESS' } });

  dispatchMessage({
    type: 'LOG_TESTING',
    payload: {
      content: 'Running tests..',
      status: 'IN_PROGRESS',
    },
  });

  const { monacoUri: uri } = state;

  if (!uri) {
    dispatch({ type: 'SET_TESTING_STATE', payload: { type: 'NOT_ASKED' } });
    dispatchMessage({
      type: 'LOG_TESTING',
      payload: { status: 'ERROR', content: 'UI Error: Monaco Editor not available' },
    });
    return;
  }

  const model = monaco.editor.getModel(uri);

  if (!model) {
    dispatch({ type: 'SET_TESTING_STATE', payload: { type: 'NOT_ASKED' } });
    dispatchMessage({
      type: 'LOG_TESTING',
      payload: { status: 'ERROR', content: 'UI Error: failed to access Monaco Editor' },
    });
    return;
  }

  const code = model.getValue();

  const result = await testingRequest({ compileUrl: TESTING_URL || '' }, { source: code }).then(
    interpret_response
  );

  dispatch({
    type: 'SET_TESTING_STATE',
    payload: { type: 'RESULT', payload: result },
  });

  const action: MessageAction | undefined = getMessageAction(result);
  if (action) dispatchMessage(action);
}
