import { State, Dispatch, RequestResult } from './reducer';

const COMPILE_URL = (() => {
  if (!process.env.COMPILE_URL) throw new Error('Compile URL not available!');
  return process.env.COMPILE_URL;
})();

export async function compile(dispatch: Dispatch, state: State) {
  if (state.compile.type === 'COMPILE_STATE_IN_PROGRESS') return;

  dispatch({ type: 'SET_COMPILE_STATE', payload: { type: 'COMPILE_STATE_IN_PROGRESS' } });

  const result = await fetch(COMPILE_URL, {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ source: 'rust source code' }),
  })
    .then(async response =>
      response.status === 200
        ? ({
            type: 'REQUEST_OK',
            payload: await response.json(),
          } as RequestResult)
        : ({
            type: 'REQUEST_ERR',
            payload: { message: 'Server error' },
          } as RequestResult)
    )
    .catch(() => ({ type: 'REQUEST_ERR', payload: { message: 'Network error' } } as RequestResult));

  dispatch({
    type: 'SET_COMPILE_STATE',
    payload: { type: 'COMPILE_STATE_RESULT', payload: result },
  });
}
