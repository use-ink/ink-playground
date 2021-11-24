import { ButtonWithIcon } from '@paritytech/components/';
import { ReactElement } from 'react';
import { GistIcon } from '~/symbols';

export const ShareSubmenu = (): ReactElement => {
  return (
    <div className="mr-8 mt-4 flex">
      <ButtonWithIcon
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
