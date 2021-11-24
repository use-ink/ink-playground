import { LabeledInputSwitch, MenuElementWrapper } from '@paritytech/components/';
import { ReactElement, useContext } from 'react';
import { AppContext } from '~/context/app/';
import { Dispatch, State } from '~/context/app/reducer';

export const SettingsSubmenu = (): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);

  return (
    <div className="w-56">
      <h2 className="px-4 pt-1 pb-2">Editor Options</h2>
      <MenuElementWrapper>
        <LabeledInputSwitch
          label={'Dark Mode'}
          checked={state.darkmode}
          onChange={() => dispatch({ type: 'SET_DARKMODE', payload: !state.darkmode })}
          data-testid="darkModeSwitch"
        />
      </MenuElementWrapper>

      <MenuElementWrapper>
        <LabeledInputSwitch
          label={'Minimap'}
          checked={state.minimap}
          onChange={() => dispatch({ type: 'SET_MINIMAP', payload: !state.minimap })}
          data-testid="minimapSwitch"
        />
      </MenuElementWrapper>

      <MenuElementWrapper>
        <LabeledInputSwitch
          label={'Numbering'}
          checked={state.numbering}
          onChange={() => dispatch({ type: 'SET_NUMBERING', payload: !state.numbering })}
          data-testid="numberingSwitch"
        />
      </MenuElementWrapper>
    </div>
  );
};
