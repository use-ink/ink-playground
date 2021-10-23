import { ReactNode } from 'react';

type MenuItem = {
  label: string;
  onClick: () => void;
  icon: ReactNode;
};

type DropDownProps = {
  icon: ReactNode;
  items: MenuItem[];
};
