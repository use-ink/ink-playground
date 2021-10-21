import { Header } from '~/components';
import { render, screen } from '@testing-library/react';

test('should render the "Header" component', () => {
  // Arrange & Act
  render(<Header />);
  const settingsButton = screen.getByText(/Settings/i);
  // Assert
  expect(settingsButton).toBeInTheDocument();
});

test('should render dropdown with editor settings', () => {
  // Arrange
  render(<Header />);
  const settingsButton = screen.getByText(/Settings/i);
  // Act
  settingsButton.click();
  // Assert
  const darkMode = screen.getByText(/Dark Mode/i);
  const minimap = screen.getByText(/Minimap/i);
  const numbering = screen.getByText(/Numbering/i);

  expect(darkMode).toBeInTheDocument();
  expect(minimap).toBeInTheDocument();
  expect(numbering).toBeInTheDocument();
});
