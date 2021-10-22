import { ReactElement } from 'react';
import Logo from '~/assets/ink-logo-on-dark.svg';
import { MainMenu } from './MainMenu';

export const Header = (): ReactElement => {
  return (
    <div className="header">
      <Logo className="h-16 w-32" data-testid="headerLogo" />
      <div className="verticalDivider"></div>
      <MainMenu />
    </div>
  );
};
