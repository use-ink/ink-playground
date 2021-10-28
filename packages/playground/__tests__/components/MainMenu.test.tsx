import { MainMenu, reducer, init } from '../../../components/src/MainMenu';
import { render, screen } from '@testing-library/react';
import { ReactElement, useReducer } from 'react';
import DemoSvg from '../../src/assets/DemoSvg';

describe('Given the MainMenu component is rendered', () => {
  beforeEach(() => {
    const MenuWithContext = (): ReactElement => {
      const [state, dispatch] = useReducer(reducer, init);
      const items = [
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
      ];

      return <MainMenu state={state} dispatch={dispatch} items={items} />;
    };

    render(<MenuWithContext />);
  });

  test('it renders MainMenu component', async () => {
    const testButton = await screen.findByText('Apple');
    expect(testButton).toBeInTheDocument();
  });
});
