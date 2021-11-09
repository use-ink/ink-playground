import { compileRequest } from '~/api/compile';
import { State, Dispatch } from './reducer';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export async function compile(dispatch: Dispatch, state: State) {
  if (state.compile.type === 'IN_PROGRESS') return;

  dispatch({ type: 'SET_COMPILE_STATE', payload: { type: 'IN_PROGRESS' } });

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
}
