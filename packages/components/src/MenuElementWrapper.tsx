import { ReactElement, ReactNode } from 'react';

export type Props = {
  children: ReactNode;
};

export const MenuElementWrapper = ({ children }: Props): ReactElement => {
  return (
    <div className="dark:bg-elevation dark:border-dark border-light border-t last:rounded-b py-2 px-4 w-full text-lg">
      {children}
    </div>
  );
};
