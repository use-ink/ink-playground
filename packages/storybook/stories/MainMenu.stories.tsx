import { MainMenu, reducer, init } from '@paritytech/components/MainMenu';
import { Props as MainMenuProps } from '@paritytech/components/MainMenu/MenuItem';
import { useReducer } from 'react';
import { Story } from '@storybook/react';
import DemoSvg from './DemoSvg';

type Props = Omit<MainMenuProps, 'state' | 'dispatch'>;

const MainMenuWithState = (props: Props) => {
  const [state, dispatch] = useReducer(reducer, init);

  return <MainMenu state={state} dispatch={dispatch} {...props} />;
};

export default {
  title: 'Example/MainMenu',
  component: MainMenuWithState,
  argTypes: {},
};

export const Default: Story<Props> = args => <MainMenuWithState {...args} />;

Default.args = {
  items: [
    { label: 'Apple', icon: DemoSvg, onClick: () => alert('apple') },
    { label: 'Pancake', icon: DemoSvg, onClick: () => alert('pancake') },
    {
      label: 'Dishes',
      icon: DemoSvg,
      subContent: () => <h2>More Dishes</h2>,
    },
    {
      label: 'Wishes',
      icon: DemoSvg,
      subContent: () => 'more wishes',
    },
  ],
};
