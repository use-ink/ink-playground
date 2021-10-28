import { ReactElement, useReducer, useRef, MouseEvent } from 'react';
import { Logo } from '~/symbols';
import { init, MainMenu, reducer } from '@paritytech/components/MainMenu';
import { CompileIcon, DownloadIcon, GithubRepoIcon, SettingsIcon } from '~/symbols';
import { OverlayPanel } from 'primereact/overlaypanel';
import { SettingsDropdown } from './SettingsDropdown';

const repoURL = 'https://github.com/paritytech/ink-playground';

const openRepoUrl = (): void => {
  window.open(repoURL, '_blank');
};

export const Header = (): ReactElement => {
  const [state, dispatch] = useReducer(reducer, init);

  const op = useRef<OverlayPanel>(null);
  const openDropdown = (e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
    op.current && op.current.toggle(e, null);
  };

  const DropdownWithContent = () => {
    return (
      <OverlayPanel ref={op} showCloseIcon dismissable>
        <SettingsDropdown />
      </OverlayPanel>
    );
  };

  const itemsLeft = [
    { label: 'Compile', icon: CompileIcon, onClick: () => alert('Compile was clicked!') },
    { label: 'Download', icon: DownloadIcon, onClick: () => alert('Download was clicked!') },
    {
      label: 'Settings',
      icon: SettingsIcon,
      onClick: openDropdown,
    },
  ];

  const itemsRight = [{ label: 'GitHub Repo', icon: GithubRepoIcon, onClick: () => openRepoUrl() }];

  return (
    <div className="header">
      <Logo className="h-16 w-32" data-testid="headerLogo" />
      <div className="verticalDivider" />
      <MainMenu state={state} dispatch={dispatch} items={itemsLeft} />
      <div className="flex-grow"></div>
      <MainMenu state={state} dispatch={dispatch} items={itemsRight} />
      <DropdownWithContent />
    </div>
  );
};
