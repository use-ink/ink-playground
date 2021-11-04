import { ReactElement } from 'react';
import { Logo } from '~/symbols';
import { CompileIcon, DownloadIcon, GithubRepoIcon, SettingsIcon } from '~/symbols';
import { ButtonWithIcon } from '@paritytech/components/ButtonWithIcon';

const openRepoUrl = (): void => {
  const repoURL = 'https://github.com/paritytech/ink-playground';
  window.open(repoURL, '_blank');
};

export const Header = (): ReactElement => {
  return (
    <div className="header">
      <Logo className="h-16 w-32" data-testid="headerLogo" />
      <div className="verticalDivider" />
      <div className={'flex p-3.5 w-full'}>
        <ButtonWithIcon
          label="Compile"
          Icon={CompileIcon}
          testId={'buttonIcon'}
          onClick={() => {
            alert('Compile!');
          }}
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

        <div className="flex-grow"></div>

        <ButtonWithIcon
          label="GitHub Repo"
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
