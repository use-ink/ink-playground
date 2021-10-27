import { ReactElement, useState } from 'react';
import { Logo } from '~/symbols';
// import { MainMenu } from '~/components/MainMenu';
import { MainMenu } from '~/App/Header/MainMenu';

export const Header = (): ReactElement => {
  const [dropdownOpen, setDropdownOpen] = useState<undefined | number>();

  return (
    <div className="header">
      <Logo className="h-16 w-32" data-testid="headerLogo" />
      <div className="verticalDivider" />
      <MainMenu />
      {/*<MainMenu
        openId={dropdownOpen}
        items={[
          { label: 'Compile', icon: '', onClick: () => {} },
          { label: 'Share', icon: '', onClick: () => {} },
          {
            label: 'Settings',
            icon: '',
            sub: {
              content: '',
              trigger: () => setDropdownOpen(1),
            },
          },
        ]}
      />*/}
    </div>
  );
};
