import { ReactElement, useContext, useRef } from 'react';
import { Logo, CompileIcon, DownloadIcon, GithubRepoIcon, SettingsIcon } from '~/symbols';
import { ButtonWithIcon } from '@paritytech/components/ButtonWithIcon';
import { OverlayPanel } from '@paritytech/components';
import { SettingsSubmenu } from './SettingsSubmenu';

import { AppContext } from '~/context';
import { Dispatch, State } from '~/context/reducer';
import { compile } from '~/context/side-effects';

const openRepoUrl = (): void => {
  const repoURL = 'https://github.com/paritytech/ink-playground';
  window.open(repoURL, '_blank');
};

export const Header = (): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);

  const settingsOverlay = useRef<OverlayPanel>(null);

  return (
    <div className="header">
      <div className="w-32">
        <Logo className="h-16 w-32" data-testid="headerLogo" />
      </div>
      <div className="verticalDivider" />
      <div className={'flex p-3.5 w-full'}>
        <ButtonWithIcon
          label="Compile"
          Icon={CompileIcon}
          testId={'buttonIcon'}
          onClick={() => compile(dispatch, state)}
        />
        <ButtonWithIcon
          label="Download"
          Icon={DownloadIcon}
          testId={'buttonIcon'}
          onClick={() => {
            alert('Download!');
          }}
        />
        <ButtonWithIcon
          label="Settings"
          Icon={SettingsIcon}
          testId={'buttonIcon'}
          onClick={e => settingsOverlay.current && settingsOverlay.current.toggle(e, null)}
        />

        <div className="flex-grow" />

        <ButtonWithIcon
          // non-breaking space "\u00A0"
          label={'GitHub\u00A0Repo'}
          Icon={GithubRepoIcon}
          testId={'buttonIcon'}
          onClick={() => {
            openRepoUrl();
          }}
        />
      </div>
      <OverlayPanel ref={settingsOverlay} showCloseIcon dismissable>
        <SettingsSubmenu />
      </OverlayPanel>
    </div>
  );
};
