export const defaultState: State = {
  darkmode: true,
  minimap: true,
  numbering: true,
  compilation: { type: 'NOT_ASKED' },
};

export type State = {
  darkmode: boolean;
  minimap: boolean;
  numbering: boolean;
  compilation: CompilationState;
};

export type CompilationResult =
  | { type: 'COMPILE_OK'; payload: { result: string } }
  | { type: 'COMPILE_ERR'; payload: { message: string } };

export type CompilationState =
  | { type: 'NOT_ASKED' }
  | { type: 'IN_PROGRESS' }
  | { type: 'RESULT'; payload: CompilationResult }
  | { type: 'FAILURE'; payload: CompilationFailure };

export type CompilationFailure = { type: 'COMPILATION_FAILURE'; payload: { message: string } };

export type Action =
  | { type: 'SET_DARKMODE'; payload: boolean }
  | { type: 'SET_NUMBERING'; payload: boolean }
  | { type: 'SET_MINIMAP'; payload: boolean }
  | { type: 'SET_COMPILATION_STATE'; payload: CompilationState }
  | { type: 'START_COMPILATION'; payload: string }
  | { type: 'RECEIVE_COMPILATION'; payload: CompilationResult };

export type Dispatch = (action: Action) => void;

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_DARKMODE':
      return {
        ...state,
        darkmode: action.payload,
      };
    case 'SET_NUMBERING':
      return {
        ...state,
        numbering: action.payload,
      };
    case 'SET_MINIMAP':
      return {
        ...state,
        minimap: action.payload,
      };
    default:
      return state;
  }
};
