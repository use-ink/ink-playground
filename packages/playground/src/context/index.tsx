import React, { ReactElement, ReactNode, useReducer } from 'react';
import { defaultState, State, reducer, Dispatch } from './reducer';

export const AppContext: React.Context<[State, Dispatch]> = React.createContext(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  [defaultState, _ => {}]
);

export type Props = {
  children: ReactNode;
};

export const AppProvider = ({ children }: Props): ReactElement => {
  const context: [State, Dispatch] = useReducer(reducer, defaultState);

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};
