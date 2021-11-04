import { ReactElement, useContext } from 'react';
import { Logo } from '~/symbols';
import { CompileIcon, DownloadIcon, GithubRepoIcon, SettingsIcon } from '~/symbols';
import { ButtonWithIcon } from '@paritytech/components/ButtonWithIcon';
import { Dispatch, State } from '~/context/reducer';
import { compile } from '~/context/side-effects';
import { AppContext } from '~/context';

const openRepoUrl = (): void => {
  const repoURL = 'https://github.com/paritytech/ink-playground';
  window.open(repoURL, '_blank');
};

export const Header = (): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);

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
          onClick={() => {
            alert('Settings!');
          }}
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
    </div>
  );
};
