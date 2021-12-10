import { ReactElement, useContext, useRef } from 'react';
import {
  Logo,
  CompileIcon,
  DownloadIcon,
  GithubRepoIcon,
  SettingsIcon,
  ShareIcon,
} from '~/symbols';
import { OverlayPanel, ButtonWithIcon } from '@paritytech/components/';
import { SettingsSubmenu } from './SettingsSubmenu';
import { ShareSubmenu } from './ShareSubmenu';

import { AppContext } from '~/context/app/';
import { MessageContext } from '~/context/messages/';
import { Dispatch, State } from '~/context/app/reducer';
import { MessageState, MessageDispatch, mapTooltipContent } from '~/context/messages/reducer';
import { compile } from '~/context/side-effects/compile';
import * as sizeLimit from '~/constants';

const openRepoUrl = (): void => {
  const repoURL = 'https://github.com/paritytech/ink-playground';
  window.open(repoURL, '_blank');
};

const mapBorderColor = (size: number | null): string => {
  if (!size) return '';
  if (size <= sizeLimit.OPTIMAL_SIZE) {
    return 'border-green-400';
  } else if (size <= sizeLimit.ACCEPTABLE_SIZE) {
    return 'border-blue-400';
  } else if (size <= sizeLimit.PROBLEMATIC_SIZE) {
    return 'border-yellow-400';
  }
  return 'border-red-400';
};

export const Header = (): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);
  const [, dispatchMessage]: [MessageState, MessageDispatch] = useContext(MessageContext);

  const settingsOverlay = useRef<OverlayPanel>(null);
  const shareOverlay = useRef<OverlayPanel>(null);

  const hasDownloadableResult =
    state.compile.type === 'RESULT' &&
    state.compile.payload.type === 'OK' &&
    state.compile.payload.payload.type === 'SUCCESS';

  const borderColor = mapBorderColor(state.contractSize);
  const tooltipContent = mapTooltipContent(state.contractSize);

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
          darkmode={state.darkmode}
          testId={'buttonIcon'}
          onClick={() => compile(state, dispatch, dispatchMessage)}
          loading={state.compile.type === 'IN_PROGRESS'}
        />
        <ButtonWithIcon
          label="Download"
          Icon={DownloadIcon}
          darkmode={state.darkmode}
          testId={'buttonIcon'}
          onClick={() => handleDownload(state)}
          disabled={!hasDownloadableResult || !state.monacoUri}
          loading={state.compile.type === 'IN_PROGRESS'}
          borderColor={borderColor}
          tooltipContent={tooltipContent}
        />
        <ButtonWithIcon
          label="Share"
          Icon={ShareIcon}
          darkmode={state.darkmode}
          testId={'buttonIcon'}
          onClick={e => shareOverlay.current && shareOverlay.current.toggle(e, null)}
        />
        <ButtonWithIcon
          label="Settings"
          Icon={SettingsIcon}
          darkmode={state.darkmode}
          testId={'buttonIcon'}
          onClick={e => settingsOverlay.current && settingsOverlay.current.toggle(e, null)}
        />

        <div className="flex-grow" />

        <ButtonWithIcon
          label={'GitHub Repo'}
          Icon={GithubRepoIcon}
          darkmode={state.darkmode}
          testId={'buttonIcon'}
          onClick={() => {
            openRepoUrl();
          }}
        />
      </div>
      <OverlayPanel ref={settingsOverlay} showCloseIcon dismissable>
        <SettingsSubmenu />
      </OverlayPanel>
      <OverlayPanel ref={shareOverlay} showCloseIcon dismissable>
        <ShareSubmenu darkmode={state.darkmode} />
      </OverlayPanel>
    </div>
  );
};

const handleDownload = (state: State) => {
  if (
    state.compile.type !== 'RESULT' ||
    state.compile.payload.type !== 'OK' ||
    state.compile.payload.payload.type !== 'SUCCESS'
  )
    return;

  const wasm = state.compile.payload.payload.payload.wasm;

  downloadBlob(wasm);
};

export const downloadBlob = (code: number[]): void => {
  const blob = new Blob([new Uint8Array(code).buffer]);

  const a = document.createElement('a');
  a.download = 'result.contract';
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = ['application/json', a.download, a.href].join(':');
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => {
    URL.revokeObjectURL(a.href);
  }, 1500);
};
