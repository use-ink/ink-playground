import { InputSwitch } from '@paritytech/components/';
import { ReactElement, useContext } from 'react';
import { AppContext } from '~/context';
import { Dispatch, State } from '~/context/reducer';

export const SettingsSubmenu = (): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);

  return (
    <div className="mr-8 w-44">
      <div className="py-2 flex justify-between">
        <p>Dark Mode</p>
        <InputSwitch
          className="settingSwitch"
          checked={state.darkmode}
          onChange={() => dispatch({ type: 'SET_DARKMODE', payload: !state.darkmode })}
          data-testid="darkModeSwitch"
        />
      </div>

      <div className="py-2 flex justify-between">
        <p>Minimap</p>
        <InputSwitch
          className="settingSwitch"
          checked={state.minimap}
          onChange={() => dispatch({ type: 'SET_MINIMAP', payload: !state.minimap })}
          data-testid="minimapSwitch"
        />
      </div>

      <div className="py-2 flex justify-between">
        <p>Numbering</p>
        <InputSwitch
          className="settingSwitch"
          checked={state.numbering}
          onChange={() => dispatch({ type: 'SET_NUMBERING', payload: !state.numbering })}
          data-testid="numberingSwitch"
        />
      </div>
    </div>
  );
};
