import { ReactElement } from 'react';
import { classnames } from '@paritytech/tailwindcss-classnames';
//import { classnames } from '../../../_generated/tailwindcss-classnames/src';
import { MenuItem } from './MenuItem';
import { Props } from './props';
export * from './state';
export * from './props';
import { defStyle } from '../style-utils';

const style = defStyle({
  root: ['flex', 'p-3.5'],
});

export const MainMenu = (props: Props): ReactElement => {
  return (
    <div className={classnames(...style.root)}>
      {props.items.map((item, index) => (
        <MenuItem key={index} {...props} {...item} id={index} />
      ))}
    </div>
  );
};
