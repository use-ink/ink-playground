import { ReactElement } from 'react';
import { Settings } from './Settings';
import Logo from '~/assets/ink-logo-on-dark.svg';

export const Header = (): ReactElement => {
  return (
    <div className="header">
      <Logo style={{ height: '4rem' }} />
      <Settings />
    </div>
  );
};
