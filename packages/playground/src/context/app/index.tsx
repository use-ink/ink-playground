import React, { ReactElement, ReactNode, useReducer, useEffect } from 'react';
import { defaultState, State, reducer, Dispatch } from './reducer';
import { setDarkMode } from './set-dark-mode';
import logger from 'use-reducer-logger';
import { NODE_ENV } from '~/env';

export const AppContext: React.Context<[State, Dispatch]> = React.createContext(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  [defaultState, _ => {}]
);

export type Props = {
  children: ReactNode;
};

export const AppProvider = ({ children }: Props): ReactElement => {
  const wrappedReducer = NODE_ENV === 'development' ? logger(reducer) : reducer;

  const [state, dispatch]: [State, Dispatch] = useReducer(wrappedReducer, defaultState);

  useEffect((): void => {
    setDarkMode(state.darkmode);
  }, [state.darkmode]);

  return <AppContext.Provider value={[state, dispatch]}>{children}</AppContext.Provider>;
};
