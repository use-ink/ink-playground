import { render, screen } from '@testing-library/react';
import { Welcome } from '~/app/WasmTest/Welcome';

test('should render the "Welcome" component', () => {
  render(<Welcome />);
  const linkElement = screen.getByText('Welcome to the ink! Playground!');
  expect(linkElement).toBeInTheDocument();
});
