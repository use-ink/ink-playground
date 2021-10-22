import React, { ReactElement, ReactNode, useReducer, useEffect } from 'react';
import { defaultState, State, reducer, Dispatch } from './reducer';
import { setDarkmode } from './setDarkmode';

export const AppContext: React.Context<[State, Dispatch]> = React.createContext(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  [defaultState, _ => {}]
);

export type Props = {
  children: ReactNode;
};

export const AppProvider = ({ children }: Props): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useReducer(reducer, defaultState);

  useEffect((): void => {
    setDarkmode(state.darkmode);
  }, [state.darkmode]);

  return <AppContext.Provider value={[state, dispatch]}>{children}</AppContext.Provider>;
};
