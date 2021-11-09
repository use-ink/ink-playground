import { compileRequest } from '~/api/compile';
import { State, Dispatch } from './reducer';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export async function compile(dispatch: Dispatch, state: State) {
  if (state.compile.type === 'IN_PROGRESS') return;

  dispatch({ type: 'SET_COMPILE_STATE', payload: { type: 'IN_PROGRESS' } });

  let { monacoUri: uri } = state;

  if (!uri) {
    return;
  }

  let model = monaco.editor.getModel(uri);

  if (!model) {
    return;
  }

  let code = model.getValue();

  const result = await compileRequest({ source: code });

  dispatch({
    type: 'SET_COMPILE_STATE',
    payload: { type: 'RESULT', payload: result },
  });
}
