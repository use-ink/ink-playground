export const defaultState: State = {
  darkmode: true,
  minimap: true,
  numbering: true,
}

export type State = {
  darkmode: boolean;
  minimap: boolean;
  numbering: boolean;
}

export type Action =
  | { type: "SET_DARKMODE"; payload: boolean }
  | { type: "SET_NUMBERING"; payload: boolean }
  | { type: "SET_MINIMAP"; payload: boolean };

export type Dispatch = (action: Action) => void

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_DARKMODE":
      return {
        ...state,
        darkmode: action.payload
      };
    case "SET_NUMBERING":
      return {
        ...state,
        numbering: action.payload
      };
    case "SET_MINIMAP":
      return {
        ...state,
        minimap: action.payload
      };
    default:
      return state;
  }
}