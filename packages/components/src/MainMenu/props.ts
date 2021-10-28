import { ReactNode } from 'react';
import { State, Action } from './state';

export type MenuItem = {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  subContent?: () => ReactNode;
};

export type Props = {
  state: State;
  dispatch: (action: Action) => void;
  items: MenuItem[];
};
