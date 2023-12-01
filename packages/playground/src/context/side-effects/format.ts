import { FormattingApiResponse, formattingRequest } from '@paritytech/ink-editor/api/format';
import { State, Dispatch } from '~/context/app/reducer';
import { MessageAction, MessageDispatch } from '~/context/messages/reducer';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { FORMATTING_URL } from '~/env';

const getMessageAction = (result: FormattingApiResponse): MessageAction | undefined => {
  switch (result.type) {
    case 'NETWORK_ERROR':
      return {
        type: 'LOG_FORMATTING',
        payload: {
          content: 'Network Error',
          status: 'ERROR',
        },
      };
    case 'SERVER_ERROR':
      return {
        type: 'LOG_FORMATTING',
        payload: {
          content: `Server Error: ${result.payload.status}`,
          status: 'ERROR',
        },
      };
    case 'FORMATTING_ERROR':
      return {
        type: 'LOG_FORMATTING',
        payload: {
          content: `Formatting Error: run Test to find out more`,
          status: 'ERROR',
        },
      };
    case 'OK':
      if (result.payload.type === 'ERROR') {
        return {
          type: 'LOG_FORMATTING',
          payload: {
            content: `Formatting Error: ${result.payload.payload.stdout}, ${result.payload.payload.stderr}`,
            status: 'ERROR',
          },
        };
      } else if (result.payload.type === 'SUCCESS') {
        return {
          type: 'LOG_FORMATTING',
          payload: {
            content: 'Formatting finished',
            status: 'DONE',
            result: result.payload,
          },
        };
      }
  }
};

function interpret_response(response: FormattingApiResponse): FormattingApiResponse {
  console.log('response: ', response);
  if (response.type === 'OK' && response.payload.type === 'SUCCESS') {
    const has_format_error = !response.payload.payload.source;
    if (has_format_error) {
      const result = { type: 'FORMATTING_ERROR' } as FormattingApiResponse;
      return result;
    }
  }
  return response;
}

export async function format(state: State, dispatch: Dispatch, dispatchMessage: MessageDispatch, version: string) {
  if (state.compile.type === 'IN_PROGRESS') return;

  dispatch({ type: 'SET_FORMATTING_STATE', payload: { type: 'IN_PROGRESS' } });

  dispatchMessage({
    type: 'LOG_FORMATTING',
    payload: {
      content: 'Running format..',
      status: 'IN_PROGRESS',
    },
  });

  const { monacoUri: uri } = state;

  if (!uri) {
    dispatch({ type: 'SET_FORMATTING_STATE', payload: { type: 'NOT_ASKED' } });
    dispatchMessage({
      type: 'LOG_FORMATTING',
      payload: { status: 'ERROR', content: 'UI Error: Monaco Editor not available' },
    });
    return;
  }

  const model = monaco.editor.getModel(uri);

  if (!model) {
    dispatch({ type: 'SET_FORMATTING_STATE', payload: { type: 'NOT_ASKED' } });
    dispatchMessage({
      type: 'LOG_FORMATTING',
      payload: { status: 'ERROR', content: 'UI Error: failed to access Monaco Editor' },
    });
    return;
  }

  const code = model.getValue();

  const result = await formattingRequest(
    { compileUrl: FORMATTING_URL || '' },
    { source: code, version }
  ).then(interpret_response);

  dispatch({
    type: 'SET_FORMATTING_STATE',
    payload: { type: 'RESULT', payload: result },
  });

  const action: MessageAction | undefined = getMessageAction(result);
  if (action) dispatchMessage(action);
}
