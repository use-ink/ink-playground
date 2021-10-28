import { ReactNode, MouseEvent } from 'react';
import { State, Action } from './state';

export type MenuItem = {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick?: (e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void | null;
  subContent?: () => ReactNode;
};

export type Props = {
  state: State;
  dispatch: (action: Action) => void;
  items: MenuItem[];
};
