import { ReactElement } from 'react';
import { MenuItem } from './MenuItem';
import { Props } from './props';
export * from './state';
export * from './props';
import { defStyles, classnames } from '../style-utils';

const style = defStyles({
  mainMenu: ['flex', 'p-3.5'],
});

export const MainMenu = (props: Props): ReactElement => {
  return (
    <div className={classnames(style.mainMenu)}>
      {props.items.map((item, index) => (
        <MenuItem key={index} {...props} {...item} id={index} />
      ))}
    </div>
  );
};
