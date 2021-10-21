import { ReactElement, useContext, useRef } from 'react';
import { AppContext } from '~/context';
import { Dispatch, State } from '~/context/reducer';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputSwitch } from 'primereact/inputswitch';

export const Settings = (): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);
  const op = useRef<OverlayPanel>(null);

  return (
    <>
      <button
        className="mt-1"
        onClick={e => {
          if (op.current) {
            op.current.toggle(e, null);
          }
        }}
      >
        <div className="flex">
          <i className="pi pi-cog pt-1 mr-1"></i>
          Settings
        </div>
      </button>
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
