import React, { ReactElement, ReactNode, useReducer } from 'react';
import { defaultState, MessageState, reducer, MessageDispatch } from './reducer';

export const MessageContext: React.Context<[MessageState, MessageDispatch]> = React.createContext(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  [defaultState, _ => {}]
);

export type Props = {
  children: ReactNode;
};

export const MessageProvider = ({ children }: Props): ReactElement => {
  const [state, dispatch]: [MessageState, MessageDispatch] = useReducer(reducer, defaultState);

  return <MessageContext.Provider value={[state, dispatch]}>{children}</MessageContext.Provider>;
};
