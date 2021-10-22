import { ReactElement } from 'react';
import Logo from '~/assets/ink-logo-on-dark.svg';
import { MainMenu } from './MainMenu';

export const Header = (): ReactElement => {
  return (
    <div className="header">
      <Logo style={{ height: '4rem' }} />
      <div className="verticalDivider"></div>
      <MainMenu />
    </div>
  );
};
