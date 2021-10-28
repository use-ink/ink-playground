import { MainMenu, reducer, init } from 'playground/src/components/MainMenu';
import { Props } from 'playground/src/components/MainMenu/MenuItem';
import { ReactElement, useReducer, useState } from 'react';

const MainMenuWithState = (props: Props) => {
  const [state, dispatch] = useReducer(reducer, init);

  return <MainMenu state={state} dispatch={dispatch} {...props} />;
};

export default {
  title: 'Example/MainMenu',
  component: MainMenuWithState,
  argTypes: {},
};

export const Primary = MainMenuWithState.bind({});

Primary.args = {
  items: [
    { label: 'Apple', icon: '', onClick: () => alert('apple') },
    { label: 'Pancake', icon: '', onClick: () => alert('pancake') },
    {
      label: 'Dishes',
      icon: '',
      subContent: () => 'more dishes',
    },
    {
      label: 'Wishes',
      icon: '',
      subContent: () => 'more wishes',
    },
  ],
};
