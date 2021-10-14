import React from 'react';
import { defaultState, State } from '/redux/reducer';

export const EditorContext: React.Context<State> = React.createContext(defaultState);
