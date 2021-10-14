import React, { ReactElement, ReactNode, useReducer, useState } from "react";
import { Action, defaultState, State, reducer } from "~/redux";

export const AppContext: React.Context<[State, (action: Action) => void]> =
  React.createContext([defaultState, (action) => { }]);

export type Props = {
  children: ReactNode;
};

export const AppProvider = ({ children }: Props): ReactElement => {
  const context = useReducer(reducer, defaultState);

  return (
    <AppContext.Provider value={context}>
      {children}
    </AppContext.Provider>
  );
};
