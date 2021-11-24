import { MenuOptionWithIcon } from '@paritytech/components/';
import { ReactElement } from 'react';
import { GithubRepoIcon, ShareIcon } from '~/symbols';

export const ShareSubmenu = (): ReactElement => {
  return (
    <div className="w-44">
      <h2 className="px-4 pt-1 pb-2">Share Options</h2>
      <MenuOptionWithIcon
        // non-breaking space "\u00A0"
        label={'Create\u00A0Gist'}
        Icon={GithubRepoIcon}
        testId={'buttonIcon'}
        onClick={() => {
          alert('Create Gist!');
        }}
      />
      <MenuOptionWithIcon
        // non-breaking space "\u00A0"
        label={'Share\u00A0Gist'}
        Icon={ShareIcon}
        testId={'buttonIcon'}
        onClick={() => {
          alert('Share Gist!');
        }}
      />
    </div>
  );
};
