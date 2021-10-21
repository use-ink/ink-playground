import { ReactElement } from 'react';
import GithubRepoIcon from '~/assets/branch.svg';

export const GithubRepo = (): ReactElement => {
  const repoURL = 'https://github.com/paritytech/ink-playground';
  return (
    <>
      <button className="navbarButton" onClick={() => window.open(repoURL, '_blank')}>
        <GithubRepoIcon className="mt-1.5 mr-1.5" />
        Github Repo
      </button>
    </>
  );
};
