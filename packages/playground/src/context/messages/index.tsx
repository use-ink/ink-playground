import React, { ReactElement, ReactNode, useReducer } from 'react';
import { defaultState, MessageState, reducer, MessageDispatch } from './reducer';
import { NODE_ENV } from '~/env';
import logger from 'use-reducer-logger';

export const MessageContext: React.Context<[MessageState, MessageDispatch]> = React.createContext(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  [defaultState, _ => {}]
);

export type Props = {
  children: ReactNode;
};

export const MessageProvider = ({ children }: Props): ReactElement => {
  const wrappedReducer = NODE_ENV === 'development' ? logger(reducer) : reducer;

  const [state, dispatch]: [MessageState, MessageDispatch] = useReducer(
    wrappedReducer,
    defaultState
  );

  return <MessageContext.Provider value={[state, dispatch]}>{children}</MessageContext.Provider>;
};
