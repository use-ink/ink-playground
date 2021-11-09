import { compileRequest } from '~/api/compile';
import { State, Dispatch } from './reducer';
import exampleCode from '../app/Editor/example-code';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export async function compile(dispatch: Dispatch, state: State) {
  if (state.compile.type === 'IN_PROGRESS') return;

  dispatch({ type: 'SET_COMPILE_STATE', payload: { type: 'IN_PROGRESS' } });

  const result = await compileRequest({ source: exampleCode });

  dispatch({
    type: 'SET_COMPILE_STATE',
    payload: { type: 'RESULT', payload: result },
  });
}
