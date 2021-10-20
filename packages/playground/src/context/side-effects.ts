import { State, Dispatch, RequestResult } from './reducer';

const COMPILE_URL = (() => {
  if (!process.env.COMPILE_URL)
    throw new Error("Compile URL not available!");
  return process.env.COMPILE_URL
})();

export async function compile(dispatch: Dispatch, state: State) {
  if (state.compile.type === 'COMPILE_STATE_IN_PROGRESS') return;

  dispatch({ type: 'SET_COMPILE_STATE', payload: { type: 'COMPILE_STATE_IN_PROGRESS' } });

  const result = await fetch(COMPILE_URL, {
    method: 'POST',
    body: JSON.stringify({ source: 'rust sourcecode' })
  }).then(response => response.json());

  console.log(result);


  // dispatch({
  //   type: 'SET_COMPILE_STATE',
  //   payload: { type: 'COMPILE_STATE_RESULT', payload: result }
  // });
}
