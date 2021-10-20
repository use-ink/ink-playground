export const defaultState: State = {
  darkmode: true,
  minimap: true,
  numbering: true,
  compile: { type: 'COMPILE_STATE_NOT_ASKED' },
};

export type State = {
  darkmode: boolean;
  minimap: boolean;
  numbering: boolean;
  compile: CompileState;
};

export type CompileResult =
  | { type: 'COMPILE_OK'; payload: { result: string } }
  | { type: 'COMPILE_ERR'; payload: { message: string } };

export type CompileState =
  | { type: 'COMPILE_STATE_NOT_ASKED' }
  | { type: 'COMPILE_STATE_IN_PROGRESS' }
  | { type: 'COMPILE_STATE_RESULT'; payload: RequestResult };

export type RequestResult =
  | { type: 'REQUEST_OK'; payload: CompileResult }
  | { type: 'REQUEST_ERR'; payload: { message: string } };

export type Action =
  | { type: 'SET_DARKMODE'; payload: boolean }
  | { type: 'SET_NUMBERING'; payload: boolean }
  | { type: 'SET_MINIMAP'; payload: boolean }
  | { type: 'SET_COMPILE_STATE'; payload: CompileState }
  | { type: 'START_COMPILE'; payload: string }
  | { type: 'RECEIVE_COMPILE'; payload: RequestResult };

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
    case 'SET_COMPILE_STATE':
      return {
        ...state,
        compile: action.payload,
      };
    default:
      return state;
  }
};
