import { ButtonProps, ButtonWithIcon } from '@paritytech/components/ButtonWithIcon';
import DemoSvg from './DemoSvg';
import { Story } from '@storybook/react';

export default {
  title: 'Example/ButtonWithIcon',
  component: ButtonWithIcon,
  argTypes: {},
};

export const Default: Story<ButtonProps> = args => <ButtonWithIcon {...args} />;

Default.args = {
  label: 'Rubber Duck',
  Icon: DemoSvg,
  onClick: () => console.log('Rubber Duck was Clicked!'),
  testId: '',
};
