import { CompileApiResponse } from '~/api/compile';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';

export const defaultState: State = {
  darkmode: true,
  minimap: true,
  numbering: true,
  compile: { type: 'NOT_ASKED' },
  monacoUri: null,
  messages: [],
};

export type State = {
  darkmode: boolean;
  minimap: boolean;
  numbering: boolean;
  compile: CompileState;
  monacoUri: Uri | null;
  messages: Message[];
};

export type CompileState =
  | { type: 'NOT_ASKED' }
  | { type: 'IN_PROGRESS' }
  | { type: 'RESULT'; payload: CompileApiResponse };

export enum Severity {
  Info = 'Info',
  Success = 'Success',
  Error = 'Error',
}

export enum Prompt {
  Welcome = 'Welcome!',
  System = 'System',
  Error = 'Error',
  Compiling = 'Compiling',
  Compiled = 'Compiled',
  CompileError = 'Compile Error',
}

export type Message = {
  severity: Severity;
  text: string;
  prompt: Prompt;
  id: string;
};

export type Action =
  | { type: 'SET_DARKMODE'; payload: boolean }
  | { type: 'SET_NUMBERING'; payload: boolean }
  | { type: 'SET_MINIMAP'; payload: boolean }
  | { type: 'SET_COMPILE_STATE'; payload: CompileState }
  | { type: 'SET_URI'; payload: Uri }
  | { type: 'SET_MESSAGE'; payload: Message };

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
    case 'SET_URI':
      return {
        ...state,
        monacoUri: action.payload,
      };
    case 'SET_MESSAGE':
      state.messages.push(action.payload);
      return {
        ...state,
      };
    default:
      return state;
  }
};
