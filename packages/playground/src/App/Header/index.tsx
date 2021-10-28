import { ReactElement, useReducer } from 'react';
import { Logo } from '~/symbols';
import { init, MainMenu, reducer } from '@paritytech/components/MainMenu';

export const Header = (): ReactElement => {
  const [state, dispatch] = useReducer(reducer, init);

  const items = [
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
  ];

  return (
    <div className="header">
      <Logo className="h-16 w-32" data-testid="headerLogo" />
      <div className="verticalDivider" />
      <MainMenu state={state} dispatch={dispatch} items={items} />
    </div>
  );
};
