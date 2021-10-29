import { Header } from '~/App/Header';
import { render, screen, waitFor } from '@testing-library/react';

describe('Given the Header component is rendered', () => {
  beforeEach(() => {
    render(<Header />);
  });

  test('When it appears on the screen', () => {
    const settingsButton = screen.getByText('Settings');
    const logoIcon = screen.getByTestId('headerLogo');

    // Then ...
    expect(settingsButton).toBeInTheDocument();
    expect(logoIcon).toBeInTheDocument();
  });

  test('When settings button was not clicked', () => {
    const darkMode = screen.queryByText('Dark Mode');

    // Then ...
    expect(darkMode).toBeNull();
  });

  test('When settings button is clicked', () => {
    const settingsButton = screen.getByText('Settings');
    settingsButton.click();
    const darkMode = screen.getByText('Dark Mode');
    const minimap = screen.getByText('Minimap');
    const numbering = screen.getByText('Numbering');

    // Then ...
    expect(darkMode).toBeInTheDocument();
    expect(minimap).toBeInTheDocument();
    expect(numbering).toBeInTheDocument();
  });

  test('When settings dropdown is closed', async () => {
    const settingsButton = screen.getByText('Settings');
    settingsButton.click();
    const closeButton = screen.getByLabelText('close');
    closeButton.click();

    // Then ...
    await waitFor(() => {
      expect(screen.queryByText('Dark Mode')).toBeNull();
    });
  });

  test('When settings button is clicked twice', async () => {
    const settingsButton = screen.getByText('Settings');
    settingsButton.click();
    settingsButton.click();

    // Then ...
    await waitFor(() => {
      expect(screen.queryByText('Dark Mode')).toBeNull();
    });
  });
});
