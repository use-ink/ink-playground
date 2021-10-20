import { CompilationResult, State, Dispatch, CompilationFailure } from './reducer';

export async function toggleLight(dispatch: Dispatch, state: State) {
  dispatch({ type: 'SET_DARKMODE', payload: false });

  setTimeout(() => {
    dispatch({ type: 'SET_DARKMODE', payload: true });
  }, 3000);
}

export async function compile(dispatch: Dispatch, state: State) {
  dispatch({ type: 'SET_COMPILATION_STATE', payload: { type: 'IN_PROGRESS' } });

  // awaite .. fetch..
  const result: CompilationResult | CompilationFailure = { type: 'COMPILE_OK' };

  switch (result.type) {
    case 'COMPILE_OK':
      dispatch({
        type: 'SET_COMPILATION_STATE',
        payload: { type: 'RESULT', payload: result.payload },
      });
  }

  dispatch({ type: 'SET_COMPILATION_STATE', payload: { type: 'IN_PROGRESS' } });
}
