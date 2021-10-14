import React, { ReactElement, ReactNode, useState } from "react";
import { Action, defaultState, State, reducer } from "~/redux/reducer";

export const AppContext: React.Context<[State, (action: Action) => void]> =
  React.createContext([defaultState, (action) => {}]);

export type Props = {
  children: ReactNode;
};

export const AppProvider = ({ children }: Props): ReactElement => {
  const [state, setState] = useState(defaultState);

  const dispatch = (action: Action): void => {
    setState(reducer(action, state));
  };

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  );
};
