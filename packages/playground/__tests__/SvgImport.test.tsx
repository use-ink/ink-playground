import { render } from '@testing-library/react';
import { ReactComponent as Logo } from '~/assets/ink-logo-on-dark.svg';

test('should import svg as React component', () => {
  render(<Logo />);
  expect(Logo).toBeDefined();
});
