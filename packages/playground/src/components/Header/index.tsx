import { ReactElement } from 'react';
const Logo = require('~/assets/ink-logo-on-dark.svg').default;

export const Header = (): ReactElement => {
  return (
    <div className="bg-primary text-primary flex">
      <Logo style={{ height: '4rem' }} />
      <button>Settings</button>
    </div>
  );
};
