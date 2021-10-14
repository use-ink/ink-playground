import { render, screen } from '@testing-library/react';
import { Welcome } from '~/components';

test('should render the "Welcome" component', () => {
  render(<Welcome />);
  const linkElement = screen.getByText(/Welcome to the ink! Playground!/i);
  expect(linkElement).toBeInTheDocument();
});
