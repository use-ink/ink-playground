import { Header } from '~/app/Header';
import { render, screen, waitFor } from '@testing-library/react';
import { AppContext, AppProvider } from '~/context/app';

describe('Given the Header component is rendered', () => {
  beforeEach(() => {
    render(<Header />);
  });

  test('When it appears on the screen', () => {
    // Then ...
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByTestId('headerLogo')).toBeInTheDocument();
  });

  test('When settings button was not clicked', () => {
    // Then ...
    expect(screen.queryByText('Dark Mode')).toBeNull();
  });

  test('When settings button is clicked', () => {
    const settingsButton = screen.getByText('Settings');
    settingsButton.click();

    // Then ...
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    expect(screen.getByText('Minimap')).toBeInTheDocument();
    expect(screen.getByText('Numbering')).toBeInTheDocument();
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

  test('When "GitHub Repo" button is clicked', () => {
    // Given
    const windowOpenMock = jest.fn();
    window.open = windowOpenMock;
    const settingsButton = screen.getByText('GitHub Repo');
    // When
    settingsButton.click();
    // Then
    expect(windowOpenMock).toHaveBeenCalledWith(
      'https://github.com/paritytech/ink-playground',
      '_blank'
    );
  });
});

describe('Given the Header interacts with context', () => {
  beforeEach(() => {
    render(
      <AppProvider>
        <Header />
        <AppContext.Consumer>
          {([state]) => {
            return (
              <>
                <p>Darkmode is {`${state.darkmode ? 'active' : 'inactive'}`}</p>
                <p>Minimap is {`${state.minimap ? 'active' : 'inactive'}`}</p>
                <p>Numbering is {`${state.numbering ? 'active' : 'inactive'}`}</p>
              </>
            );
          }}
        </AppContext.Consumer>
      </AppProvider>
    );
  });

  test('When context defaults are unchanged', () => {
    const settingsButton = screen.getByText('Settings');
    settingsButton.click();

    // Then darkmode, numbering and minimap are active
    expect(screen.getByText('Darkmode is active')).toBeInTheDocument();
    expect(screen.getByText('Minimap is active')).toBeInTheDocument();
    expect(screen.getByText('Numbering is active')).toBeInTheDocument();
  });

  test('When dark mode is toggled', () => {
    const settingsButton = screen.getByText('Settings');
    settingsButton.click();

    const toggleSwitch = screen.getByTestId('darkModeSwitch');
    toggleSwitch.click();

    // Then ...
    expect(screen.getByText('Darkmode is inactive')).toBeInTheDocument();
  });

  test('When minimap is toggled', () => {
    const settingsButton = screen.getByText('Settings');
    settingsButton.click();

    const toggleSwitch = screen.getByTestId('minimapSwitch');
    toggleSwitch.click();

    // Then ...
    expect(screen.getByText('Minimap is inactive')).toBeInTheDocument();
  });

  test('When numbering is toggled', () => {
    const settingsButton = screen.getByText('Settings');
    settingsButton.click();

    const toggleSwitch = screen.getByTestId('numberingSwitch');
    toggleSwitch.click();

    // Then ...
    expect(screen.getByText('Numbering is inactive')).toBeInTheDocument();
  });
});
