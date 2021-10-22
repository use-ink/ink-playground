import { render, screen } from '@testing-library/react';
import { Welcome } from '~/components';

test('Given the Welcome component is imported', () => {
  // When it is rendered
  render(<Welcome />);
  const linkElement = screen.getByText('Welcome to the ink! Playground!');
  // Then ...
  expect(linkElement).toBeInTheDocument();
});
