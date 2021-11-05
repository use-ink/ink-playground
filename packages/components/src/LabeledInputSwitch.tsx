import { InputSwitch, InputSwitchProps } from '.';
import { ReactElement } from 'react';

export interface Props extends InputSwitchProps {
  label: string;
  'data-testid': string;
}

export const LabeledInputSwitch = (props: Props): ReactElement => {
  return (
    <div className="py-2 flex justify-between">
      <p>{props.label}</p>
      <InputSwitch {...props} />
    </div>
  );
};
