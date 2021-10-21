import { ReactElement } from 'react';
import { Settings, Compile, Download, GithubRepo } from './menu';
import Logo from '~/assets/ink-logo-on-dark.svg';

export const Header = (): ReactElement => {
  return (
    <div className="header">
      <Logo style={{ height: '4rem' }} />
      <div className="verticalDivider"></div>
      <div className="p-3.5 flex w-full">
        <Compile />
        <Download />
        <Settings />
        <div className="flex-grow"></div>
        <GithubRepo />
      </div>
    </div>
  );
};
