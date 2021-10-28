import { ReactElement } from 'react';
import { MenuItem } from './MenuItem';
import { Props } from './props';
export * from './state';
export * from './props';

export const MainMenu = (props: Props): ReactElement => {
  return (
    <div style={{ border: '1px solid blue' }}>
      {props.items.map((item, index) => (
        <MenuItem key={index} {...props} {...item} id={index} />
      ))}
    </div>
  );
};
