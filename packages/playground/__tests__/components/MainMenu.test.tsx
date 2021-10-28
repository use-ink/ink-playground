import { MainMenu, reducer, init } from '@paritytech/components/MainMenu';
import { render } from '@testing-library/react';
import { useReducer } from 'react';

describe('Given the MainMeu component is rendered', () => {
  beforeEach(() => {
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

    const [state, dispatch] = useReducer(reducer, init);
    render(<MainMenu state={state} dispatch={dispatch} items={items} />);
  });
});
