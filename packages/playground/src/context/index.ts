import React from 'react';
import { defaultState, State } from '~/redux/reducer';

export const AppContext: React.Context<State> = React.createContext(defaultState);

