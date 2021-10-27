import { ReactElement, ReactNode } from 'react';
import { MenuItem } from './MenuItem';

export type Id = number;

export type MenuItem = {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  sub?: { content: ReactNode; trigger: (id: Id) => void };
};

export type Props = {
  openId?: Id;
  items: MenuItem[];
};

export const MainMenu = (props: Props): ReactElement => {
  return (
    <div style={{ border: '1px solid blue' }}>
      {props.items.map((item, index) => (
        <MenuItem key={index} {...item} id={index} openId={props.openId} />
      ))}
    </div>
  );
};
