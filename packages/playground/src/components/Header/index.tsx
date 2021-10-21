import { ReactElement } from 'react';
import { Settings } from './Settings';
import Logo from '~/assets/ink-logo-on-dark.svg';

export const Header = (): ReactElement => {
  return (
    <div className="dark:text-primary dark:bg-primary dark:border-dark border-light border-b text-light flex">
      <Logo style={{ height: '4rem' }} />
      <Settings />
    </div>
  );
};
