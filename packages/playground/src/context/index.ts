import React from 'react';
import { Action, defaultState, State } from '~/redux/reducer';

export const AppContext: React.Context<[State, (action: Action) => void]> = React.createContext([
    defaultState,
    (action) => { }
]);

