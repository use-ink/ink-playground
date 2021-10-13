import { render, screen } from '@testing-library/react';
import Welcome from '../src/components/WasmTest/Welcome';

test('should render the "Welcome" component', () => {
  render(<Welcome />);
  const linkElement = screen.getByText(/Welcome to the ink! Playground!/i);
  expect(linkElement).toBeInTheDocument();
});
