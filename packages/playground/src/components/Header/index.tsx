import { ReactElement } from 'react';
import Logo from '~/components/svgComponents/InkLogoOnDark';

export const Header = (): ReactElement => {
  return (
    <div className="bg-primary text-primary flex">
      <Logo style={{ height: '4rem' }} />
      <button>Settings</button>
    </div>
  );
};
