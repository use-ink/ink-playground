import { MainMenu, reducer, init } from '@paritytech/components/MainMenu';
import { Props as MainMenuProps } from '@paritytech/components/MainMenu/MenuItem';
import { useReducer } from 'react';
import { Story } from '@storybook/react';

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
    { label: 'Apple', icon: '', onClick: () => alert('apple') },
    { label: 'Pancake', icon: '', onClick: () => alert('pancake') },
    {
      label: 'Dishes',
      icon: '',
      subContent: () => <h2>More Dishes</h2>,
    },
    {
      label: 'Wishes',
      icon: '',
      subContent: () => 'more wishes',
    },
  ],
};
