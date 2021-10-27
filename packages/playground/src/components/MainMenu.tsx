import { ReactElement, ReactNode } from 'react';

export type HandlerOrPanel = (() => void) | ReactNode;

export type MenuItem = {
  label: string;
  icon: ReactNode;
  sub: HandlerOrPanel;
};

export type Props = {
  items: MenuItem[];
};

export const MainMenu = (props: Props): ReactElement => {
  return <div>....</div>;
};
