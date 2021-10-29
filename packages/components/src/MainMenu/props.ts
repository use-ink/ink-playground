import { ReactNode, MouseEvent } from 'react';
import { State, Action } from './state';

export type SvgrComponent = React.FC<React.SVGProps<SVGSVGElement>>;

export type ReactMouseEvent = MouseEvent<HTMLButtonElement, globalThis.MouseEvent>;

export type MenuItem = {
  label: string;
  icon: SvgrComponent;
  onClick?: (e?: ReactMouseEvent) => void | null;
  subContent?: () => ReactNode;
};

export type Props = {
  state: State;
  dispatch: (action: Action) => void;
  items: MenuItem[];
};
