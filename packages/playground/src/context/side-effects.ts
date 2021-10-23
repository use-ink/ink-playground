import { compileRequest } from '~/api/compile';
import { State, Dispatch } from './reducer';

export async function compile(dispatch: Dispatch, state: State) {
  if (state.compile.type === 'IN_PROGRESS') return;

  dispatch({ type: 'SET_COMPILE_STATE', payload: { type: 'IN_PROGRESS' } });

  const result = await compileRequest({ source: 'some rusty rust' });

  dispatch({
    type: 'SET_COMPILE_STATE',
    payload: { type: 'RESULT', payload: result },
  });
}
