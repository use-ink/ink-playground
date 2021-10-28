import { ReactElement } from 'react';
import { classnames } from '@paritytech/tailwindcss-classnames';
import { MenuItem } from './MenuItem';
import { Props } from './props';
export * from './state';
export * from './props';
import * as style from './style';
import { defStyle } from '~/style-utils';

const styles = defStyle({
  root: ['flex', 'w-full', 'text-light'],
});

export const MainMenu = (props: Props): ReactElement => {
  return (
    <div className={classnames(style.root)}>
      {props.items.map((item, index) => (
        <MenuItem key={index} {...props} {...item} id={index} />
      ))}
    </div>
  );
};
