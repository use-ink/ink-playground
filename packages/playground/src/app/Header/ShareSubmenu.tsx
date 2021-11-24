import { MenuOptionWithIcon } from '@paritytech/components/';
import { ReactElement } from 'react';
import { GistIcon } from '~/symbols';

export const ShareSubmenu = (): ReactElement => {
  return (
    <div className="w-44">
      <h2 className="px-2 pt-1 pb-2">Share Options</h2>
      <MenuOptionWithIcon
        // non-breaking space "\u00A0"
        label={'Create\u00A0Gist'}
        Icon={GistIcon}
        testId={'buttonIcon'}
        onClick={() => {
          alert('Share Gist!');
        }}
      />
    </div>
  );
};
