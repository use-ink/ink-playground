import { ReactElement, MouseEvent, useContext, useRef } from 'react';
import { AppContext } from '~/context';
import { Dispatch, State } from '~/context/reducer';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputSwitch } from 'primereact/inputswitch';
import CompileIcon from '~/assets/compile.svg';
import DownloadIcon from '~/assets/download.svg';
import GithubRepoIcon from '~/assets/branch.svg';
import SettingsIcon from '~/assets/settings.svg';
import { ButtonWithIcon } from '../Buttons';

export const MainMenu = (): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);
  const op = useRef<OverlayPanel>(null);
  const repoURL = 'https://github.com/paritytech/ink-playground';

  const openRepoUrl = (): void => {
    window.open(repoURL, '_blank');
  };

  const openDropdown = (e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
    op.current && op.current.toggle(e, null);
  };

  return (
    <>
      <div className="p-3.5 flex w-full">
        <ButtonWithIcon
          label="Compile"
          Icon={CompileIcon}
          onClickHandler={() => console.log('Compile was clicked!')}
        />
        <ButtonWithIcon
          label="Download"
          Icon={DownloadIcon}
          onClickHandler={() => console.log('Download was clicked!')}
        />
        <ButtonWithIcon label="Settings" Icon={SettingsIcon} onClickHandler={openDropdown} />
        <div className="flex-grow"></div>
        <ButtonWithIcon label="GitHub Repo" Icon={GithubRepoIcon} onClickHandler={openRepoUrl} />
      </div>
      <OverlayPanel ref={op} showCloseIcon dismissable>
        <div className="py-2 flex justify-between">
          <p>Dark Mode</p>
          <InputSwitch
            className="settingSwitch"
            checked={state.darkmode}
            onChange={() => dispatch({ type: 'SET_DARKMODE', payload: !state.darkmode })}
          />
        </div>

        <div className="py-2 flex justify-between">
          <p>Minimap</p>
          <InputSwitch
            className="settingSwitch"
            checked={state.minimap}
            onChange={() => dispatch({ type: 'SET_MINIMAP', payload: !state.minimap })}
          />
        </div>

        <div className="py-2 flex justify-between">
          <p>Numbering</p>
          <InputSwitch
            className="settingSwitch"
            checked={state.numbering}
            onChange={() => dispatch({ type: 'SET_NUMBERING', payload: !state.numbering })}
          />
        </div>
      </OverlayPanel>
    </>
  );
};
