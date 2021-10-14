import React, { ReactElement, ReactNode, useReducer } from 'react';
import { Action, defaultState, State, reducer, Dispatch } from './reducer';

export const AppContext: React.Context<[State, Dispatch]> = React.createContext(
  [defaultState, (_) => {}]
);

export type Props = {
  children: ReactNode;
};

export const AppProvider = ({ children }: Props): ReactElement => {
  const context: [State, Dispatch] = useReducer(reducer, defaultState);

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};
