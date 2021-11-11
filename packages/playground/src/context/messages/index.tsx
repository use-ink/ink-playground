import React, { ReactElement, ReactNode, useReducer } from 'react';
import { defaultState, State, reducer, Dispatch } from './reducer';

export const MessageContext: React.Context<[State, Dispatch]> = React.createContext(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  [defaultState, _ => {}]
);

export type Props = {
  children: ReactNode;
};

export const MessageProvider = ({ children }: Props): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useReducer(reducer, defaultState);

  return <MessageContext.Provider value={[state, dispatch]}>{children}</MessageContext.Provider>;
};
