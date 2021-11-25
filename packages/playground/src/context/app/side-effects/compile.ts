import { CompileApiResponse, compileRequest } from '~/api/compile';
import { State, Dispatch } from '~/context/app/reducer';
import { MessageAction, MessageDispatch } from '~/context/messages/reducer';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const getMessageAction = (result: CompileApiResponse): MessageAction | undefined => {
  switch (result.type) {
    case 'NETWORK_ERROR':
      return {
        type: 'LOG_COMPILE',
        payload: {
          content: 'Network Error',
          status: 'ERROR',
        },
      };
    case 'SERVER_ERROR':
      return {
        type: 'LOG_COMPILE',
        payload: {
          content: `Server Error: ${result.payload.status}`,
          status: 'ERROR',
        },
      };
    case 'OK':
      if (result.payload.type === 'ERROR') {
        return {
          type: 'LOG_COMPILE',
          payload: {
            content: `Compilation Error: ${result.payload.payload.stdout}, ${result.payload.payload.stderr}`,
            status: 'ERROR',
          },
        };
      } else if (result.payload.type === 'SUCCESS') {
        return {
          type: 'LOG_COMPILE',
          payload: {
            content: 'Compiling finished',
            status: 'DONE',
            result: result.payload,
          },
        };
      }
  }
};

export async function compile(state: State, dispatch: Dispatch, dispatchMessage: MessageDispatch) {
  if (state.compile.type === 'IN_PROGRESS') return;

  dispatch({ type: 'SET_COMPILE_STATE', payload: { type: 'IN_PROGRESS' } });

  dispatchMessage({
    type: 'LOG_COMPILE',
    payload: {
      content: 'Compiling has started...',
      status: 'IN_PROGRESS',
    },
  });

  const { monacoUri: uri } = state;

  if (!uri) {
    // ToDo: implement proper error handling
    dispatch({ type: 'SET_COMPILE_STATE', payload: { type: 'NOT_ASKED' } });
    return;
  }

  const model = monaco.editor.getModel(uri);

  if (!model) {
    // ToDo: implement proper error handling
    dispatch({ type: 'SET_COMPILE_STATE', payload: { type: 'NOT_ASKED' } });
    return;
  }

  const code = model.getValue();

  const result = await compileRequest({ source: code });

  dispatch({
    type: 'SET_COMPILE_STATE',
    payload: { type: 'RESULT', payload: result },
  });

  const action: MessageAction | undefined = getMessageAction(result);
  if (action) dispatchMessage(action);
}
