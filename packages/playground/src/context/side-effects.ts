import { State, Dispatch, RequestResult } from './reducer';

export async function compile(dispatch: Dispatch, state: State) {
  if (state.compile.type === 'COMPILE_STATE_IN_PROGRESS') return;

  dispatch({ type: 'SET_COMPILE_STATE', payload: { type: 'COMPILE_STATE_IN_PROGRESS' } });

  setTimeout(() => {
    // await .. fetch..
    const result: RequestResult = {
      type: 'REQUEST_OK',
      payload: { type: 'COMPILE_OK', payload: { result: '' } },
    };

    dispatch({
      type: 'SET_COMPILE_STATE',
      payload: { type: 'COMPILE_STATE_RESULT', payload: result }
    });
  }, 3000);
}
