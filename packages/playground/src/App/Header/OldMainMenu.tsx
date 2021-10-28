import { ReactElement, MouseEvent, useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { SettingsDropdown } from './SettingsDropdown';
import { CompileIcon, DownloadIcon, GithubRepoIcon, SettingsIcon } from '~/symbols';
import { ButtonWithIcon } from '@paritytech/components/ButtonWithIcon';

export const MainMenu = (): ReactElement => {
  const op = useRef<OverlayPanel>(null);
  const repoURL = 'https://github.com/paritytech/ink-playground';

  const openRepoUrl = (): void => {
    window.open(repoURL, '_blank');
  };

  const openDropdown = (e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
    op.current && op.current.toggle(e, null);
  };

  return (
    <>
      <div className="p-3.5 flex w-full">
        <ButtonWithIcon
          label="Compile"
          Icon={CompileIcon}
          onClick={() => console.log('Compile was clicked!')}
        />
        <ButtonWithIcon
          label="Download"
          Icon={DownloadIcon}
          onClick={() => console.log('Download was clicked!')}
        />
        <ButtonWithIcon label="Settings" Icon={SettingsIcon} onClick={openDropdown} />
        <div className="flex-grow"></div>
        <ButtonWithIcon label="GitHub Repo" Icon={GithubRepoIcon} onClick={openRepoUrl} />
      </div>
      <OverlayPanel ref={op} showCloseIcon dismissable>
        <SettingsDropdown />
      </OverlayPanel>
    </>
  );
};
