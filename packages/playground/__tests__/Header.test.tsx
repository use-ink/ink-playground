import { Header } from '~/app/Header';
import { render, screen, waitFor } from '@testing-library/react';
import { AppContext, AppProvider } from '~/context';

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

  test('When defaults are unchanged', () => {
    render(
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
    );
    const darkmodeContextValue = screen.getByText('Darkmode is active');
    const minimapContextValue = screen.getByText('Minimap is active');
    const numberingContextValue = screen.getByText('Numbering is active');

    // Then darkmode, numbering and minimap are active
    expect(darkmodeContextValue).toBeInTheDocument();
    expect(minimapContextValue).toBeInTheDocument();
    expect(numberingContextValue).toBeInTheDocument();
  });

  test('When dark mode is toggled', async () => {
    render(
      <AppProvider>
        <AppContext.Consumer>
          {([state, dispatch]) => {
            return (
              <>
                <button
                  onClick={() => {
                    dispatch({ type: 'SET_DARKMODE', payload: !state.darkmode });
                  }}
                >
                  Toggle Dark Mode
                </button>
                <p>Darkmode is {`${state.darkmode ? 'active' : 'inactive'}`}</p>
              </>
            );
          }}
        </AppContext.Consumer>
      </AppProvider>
    );

    const toggleDarkMode = screen.getByText('Toggle Dark Mode');
    toggleDarkMode.click();

    // Then darkmode is inactive
    expect(
      await screen.findByText('Darkmode is inactive', {}, { timeout: 3000 })
    ).toBeInTheDocument();
  });

  //// The next test would be a better approach and would likely pass, but due to a bug
  //// in primereact it is currently failing with the following error:
  ////
  //// "TypeError: Cannot set property 'isPanelClicked' of undefined"
  ////
  //// The bug was fixed on Nov. 03 (https://github.com/primefaces/primereact/pull/2348)
  //// and the fixed version will be released in the next days.

  /* test('When dark mode is toggled', async () => {
    const settingsButton = screen.getByText('Settings');
    settingsButton.click();

    const darkModeToggle = screen.getByTestId('darkModeSwitch');
    darkModeToggle.click();

    render(<ContextConsumer />);

    // Then darkmode is inactive
    await waitFor(() => {
      expect(screen.getByText('Darkmode is inactive')).toBeInTheDocument();
    });
  }); */
});
