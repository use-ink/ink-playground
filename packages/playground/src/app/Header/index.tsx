import { ReactElement, useContext, useRef } from 'react';
import { Logo, CompileIcon, DownloadIcon, GithubRepoIcon, SettingsIcon } from '~/symbols';
import { OverlayPanel, ButtonWithIcon } from '@paritytech/components/';
import { SettingsSubmenu } from './SettingsSubmenu';

import { AppContext } from '~/context/app/';
import { MessageContext } from '~/context/messages/';
import { Dispatch, State } from '~/context/app/reducer';
import { MessageState, MessageDispatch } from '~/context/messages/reducer';
import { compile } from '~/context/app/side-effects';

const openRepoUrl = (): void => {
  const repoURL = 'https://github.com/paritytech/ink-playground';
  window.open(repoURL, '_blank');
};

export const Header = (): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);
  const [, dispatchMessage]: [MessageState, MessageDispatch] = useContext(MessageContext);

  const settingsOverlay = useRef<OverlayPanel>(null);

  return (
    <div className="dark:text-primary dark:bg-primary dark:border-dark border-light border-b text-light flex max-h-16">
      <div className="w-32">
        <Logo className="h-16 w-32" data-testid="headerLogo" />
      </div>
      <div className="border-l max-h-8 mt-4 dark:border-dark border-light" />
      <div className={'flex p-3.5 w-full'}>
        <ButtonWithIcon
          label="Compile"
          Icon={CompileIcon}
          testId={'buttonIcon'}
          onClick={() => compile(state, dispatch, dispatchMessage)}
        />
        <ButtonWithIcon
          label="Download"
          Icon={DownloadIcon}
          testId={'buttonIcon'}
          onClick={() => {
            alert('Download!');
          }}
          loading={state.compile.type === 'IN_PROGRESS'}
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
