import { ReactElement, ReactNode, MouseEvent } from 'react';

export type Props = {
  children: ReactNode;
  onClick: (
    e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void | Promise<void> | null;
};

export const MenuSelectElementWrapper = ({ children, onClick }: Props): ReactElement => {
  return (
    <button
      className="dark:bg-elevation dark:border-dark border-light border-t last:rounded-b py-2 px-4 w-full text-lg"
      onClick={(e?) => onClick(e)} >
      {children}
    </button>
  );
};
