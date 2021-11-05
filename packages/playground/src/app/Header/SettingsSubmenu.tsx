import { InputSwitch, LabeledInputSwitch } from '@paritytech/components/';
import { ReactElement, useContext } from 'react';
import { AppContext } from '~/context';
import { Dispatch, State } from '~/context/reducer';

export const SettingsSubmenu = (): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);

  return (
    <div className="mr-8 w-44">
      <LabeledInputSwitch
        label={'Dark Mode'}
        checked={state.darkmode}
        onChange={() => dispatch({ type: 'SET_DARKMODE', payload: !state.darkmode })}
        testId="darkModeSwitch"
      />

      <LabeledInputSwitch
        label={'Minimap'}
        checked={state.minimap}
        onChange={() => dispatch({ type: 'SET_MINIMAP', payload: !state.minimap })}
        testId="minimapSwitch"
      />

      <LabeledInputSwitch
        label={'Numbering'}
        checked={state.numbering}
        onChange={() => dispatch({ type: 'SET_NUMBERING', payload: !state.numbering })}
        testId="numberingSwitch"
      />
    </div>
  );
};
