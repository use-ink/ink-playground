import { ReactElement, ReactNode } from 'react';

export type HandlerOrPanel = (() => void) | ReactNode;

export type MenuItem = {
  label: string;
  icon: ReactNode;
  sub: HandlerOrPanel;
  id: string;
};

export type Props = MenuItem & { isOpen: boolean; triggerSub: () => void };

export const MenuItem = (props: Props): ReactElement => {
  return <button onClick={() => props.triggerSub()}>Text</button>;
};
