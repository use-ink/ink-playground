import { MainMenu } from '~/components';
import { render } from '@testing-library/react';

describe('Given the MainMeu component is rendered', () => {
  beforeEach(() => {
    render(<MainMenu items={[]} />);
  });
});
