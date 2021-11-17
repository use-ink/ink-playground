import { LabeledInputSwitch } from '../src';
import { render, screen } from '@testing-library/react';

describe('Given the LabeledInputSwitch component is rendered', () => {
  const switchLabelText = 'Switch Label';
  const switchTestId = 'switchTestId';
  let switchState = true;
  const toggleSwitchState = () => {
    switchState = !switchState;
  };

  beforeEach(() => {
    render(
      <LabeledInputSwitch
        label={switchLabelText}
        checked={switchState}
        onChange={() => toggleSwitchState()}
        data-testid={switchTestId}
      />
    );
  });

  test('When Switch appears on screen', async () => {
    // Given, When
    const switchLabel = await screen.findByText(switchLabelText);
    const inputSwitch = await screen.findByTestId(switchTestId);

    // Then ...
    expect(switchLabel).toBeInTheDocument();
    expect(inputSwitch).toBeInTheDocument();
    expect(switchState).toBeTruthy();
  });

  test('When Switch is toggled', async () => {
    // Given
    const inputSwitch = await screen.findByTestId(switchTestId);
    // When
    inputSwitch.click();
    // Then ...
    expect(switchState).toBeFalsy();
  });
});
