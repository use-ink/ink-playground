import { InputSwitch } from '.';
import { ReactElement } from 'react';

export type Props = {
  label: string;
  checked: boolean;
  onChange: () => void;
  testId: string;
};

export const LabeledInputSwitch = (props: Props): ReactElement => {
  return (
    <div className="py-2 flex justify-between">
      <p>{props.label}</p>
      <InputSwitch
        className="settingSwitch"
        checked={props.checked}
        onChange={() => props.onChange()}
        data-testid={props.testId}
      />
    </div>
  );
};
