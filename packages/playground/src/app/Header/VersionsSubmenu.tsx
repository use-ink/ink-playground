import { MenuElementWrapper } from '@paritytech/components/';
import { ReactElement, useContext } from 'react';
import { AppContext } from '~/context/app/';
import { Dispatch, State } from '~/context/app/reducer';

export const VersionsSubmenu = (): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);

  return (
    <div className="w-56">
      <h2 className="px-4 pt-1 pb-2">Supported Versions</h2>
      {state.versionList.map((version) => (
        <MenuElementWrapper>
          {version}
        </MenuElementWrapper>
      ))}
    </div>
  );
};
