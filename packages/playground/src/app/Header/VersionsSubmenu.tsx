import { MenuSelectElementWrapper } from '@paritytech/components/';
import { ReactElement, useContext } from 'react';
import { AppContext } from '~/context/app/';
import { Dispatch, State } from '~/context/app/reducer';
import { setVersion } from '~/context/side-effects/version';

export const VersionsSubmenu = (): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);

  return (
    <div className="w-56">
      <h2 className="px-4 pt-1 pb-2">Supported Versions</h2>
      {state.versionList.map(version => (
        <MenuSelectElementWrapper
          onClick={() => {
            setVersion(version, state, { app: dispatch });
          }}
        >
          {version} {state.version === version ? '- Active' : ''}
        </MenuSelectElementWrapper>
      ))}
    </div>
  );
};
